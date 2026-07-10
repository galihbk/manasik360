import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  async getPaths(user: any) {
    // 1. Check if the database has 12 content items and correct sequence order
    const contentCount = await this.prisma.learningContent.count();
    const firstLesson = await this.prisma.lesson.findFirst({ where: { order: 0 } });
    if (contentCount !== 12 || firstLesson?.title !== 'Physical Readiness Protocols') {
      await this.autoSeedHajjData();
    }

    // 2. Fetch products and sub-paths from the actual database
    const dbProducts = await this.prisma.product.findMany({
      include: {
        paths: {
          include: {
            courses: {
              include: {
                modules: {
                  include: {
                    lessons: {
                      include: {
                        contents: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // 3. Map db schema into clean frontend models representation
    const completedLogs = await this.prisma.auditLog.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.id,
        action: 'COMPLETE',
        entityName: 'Lesson'
      }
    });
    const completedLessonIds = new Set(completedLogs.map((log: any) => log.entityId));

    const progressLogs = await this.prisma.auditLog.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.id,
        action: 'LESSON_PROGRESS',
        entityName: 'Lesson'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const lessonProgressMap = new Map<string, { activeTab: string; maxUnlockedStep: number; quizAnswers: any; quizScore: number | null }>();
    progressLogs.forEach((log: any) => {
      if (!lessonProgressMap.has(log.entityId)) {
        const vals = log.newValues as any;
        if (vals && typeof vals === 'object') {
          lessonProgressMap.set(log.entityId, {
            activeTab: vals.activeTab || 'overview',
            maxUnlockedStep: typeof vals.maxUnlockedStep === 'number' ? vals.maxUnlockedStep : 0,
            quizAnswers: vals.quizAnswers || null,
            quizScore: typeof vals.quizScore === 'number' ? vals.quizScore : null
          });
        }
      }
    });

    const courses: any[] = [];
    dbProducts.forEach((product: any) => {
      product.paths.forEach((path: any) => {
        path.courses.forEach((course: any) => {
          const courseLessons = course.modules.flatMap((mod: any) => mod.lessons);
          const totalLessons = courseLessons.length;
          const completedCount = courseLessons.filter((l: any) => completedLessonIds.has(l.id)).length;
          const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

          const sortedLessons = courseLessons.sort((a: any, b: any) => a.order - b.order);
          const mappedLessons = sortedLessons.map((lesson: any, index: number) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            let status = 'locked';

            if (isCompleted) {
              status = 'completed';
            } else if (index === 0) {
              status = 'in-progress';
            } else {
              const prevLesson = sortedLessons[index - 1];
              const isPrevCompleted = completedLessonIds.has(prevLesson.id);
              status = isPrevCompleted ? 'in-progress' : 'locked';
            }

            const prog = lessonProgressMap.get(lesson.id);

            return {
              id: lesson.id,
              title: lesson.title,
              duration: lesson.description || '15 mins',
              type: lesson.contents[0]?.type === 'VIRTUAL_TOUR' ? '3DVista Virtual Tour' : lesson.contents[0]?.type || 'Reading',
              status,
              activeTab: prog?.activeTab || 'overview',
              maxUnlockedStep: prog ? prog.maxUnlockedStep : (isCompleted ? 4 : 0),
              quizAnswers: prog?.quizAnswers || null,
              quizScore: prog?.quizScore !== undefined && prog?.quizScore !== null ? prog.quizScore : (isCompleted ? 100 : null),
              readingContent: lesson.contents.find((c: any) => c.type === 'READING')?.resourceUrl || lesson.contents[0]?.resourceUrl || 'Read materials online.',
              virtualTourUrl: lesson.contents.find((c: any) => c.type === 'VIRTUAL_TOUR')?.resourceUrl || null
            };
          });

          courses.push({
            id: course.id,
            title: course.title,
            description: course.description,
            progress,
            lessons: mappedLessons
          });
        });
      });
    });

    return { courses };
  }

  async completeLesson(lessonId: string, user: any) {
    const existing = await this.prisma.auditLog.findFirst({
      where: {
        tenantId: user.tenantId,
        userId: user.id,
        action: 'COMPLETE',
        entityName: 'Lesson',
        entityId: lessonId
      }
    });

    if (!existing) {
      await this.prisma.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: 'COMPLETE',
          entityName: 'Lesson',
          entityId: lessonId
        }
      });
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } }
    });

    if (lesson) {
      const course = lesson.module.course;
      const dbLessons = await this.prisma.lesson.findMany({
        where: { module: { courseId: course.id } }
      });
      const totalLessons = dbLessons.length;

      const completedCount = await this.prisma.auditLog.count({
        where: {
          tenantId: user.tenantId,
          userId: user.id,
          action: 'COMPLETE',
          entityName: 'Lesson',
          entityId: { in: dbLessons.map((l: any) => l.id) }
        }
      });

      if (completedCount === totalLessons) {
        const certExists = await this.prisma.certificate.findFirst({
          where: { userId: user.id, courseId: course.id }
        });

        if (!certExists) {
          const pdfName = `cert-${course.title.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}.pdf`;
          await this.prisma.certificate.create({
            data: {
              userId: user.id,
              courseId: course.id,
              pdfUrl: `/files/certificates/${pdfName}`
            }
          });

          await this.prisma.notification.create({
            data: {
              userId: user.id,
              type: 'CERTIFICATE',
              title: 'Selamat! Sertifikat Kelulusan Terbit',
              message: `Anda telah berhasil menyelesaikan semua materi pada kelas "${course.title}". Unduh sertifikat Anda di halaman Sertifikat.`
            }
          });
        }
      }
    }

    return { success: true, message: 'Lesson marked as completed successfully.' };
  }

  async saveLessonProgress(lessonId: string, body: { activeTab: string; maxUnlockedStep: number; quizAnswers?: any; quizScore?: number | null }, user: any) {
    const { activeTab, maxUnlockedStep, quizAnswers, quizScore } = body;

    const log = await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: 'LESSON_PROGRESS',
        entityName: 'Lesson',
        entityId: lessonId,
        newValues: { activeTab, maxUnlockedStep, quizAnswers, quizScore }
      }
    });

    return { success: true, log };
  }

  async getCertificates(user: any) {
    const certs = await this.prisma.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: { id: true, title: true, description: true }
        }
      }
    });

    const verifiedCerts = [];

    for (const cert of certs) {
      const lessons = await this.prisma.lesson.findMany({
        where: { module: { courseId: cert.courseId } },
        select: { id: true }
      });
      const lessonIds = lessons.map((l: any) => l.id);

      if (lessonIds.length === 0) continue;

      const completedCount = await this.prisma.auditLog.count({
        where: {
          userId: user.id,
          action: 'COMPLETE_LESSON',
          entityId: { in: lessonIds }
        }
      });

      if (completedCount === lessonIds.length) {
        verifiedCerts.push(cert);
      }
    }

    return verifiedCerts;
  }

  async getSubscription(user: any) {
    const buyLogs = await this.prisma.auditLog.findMany({
      where: { tenantId: user.tenantId, action: 'BUY_PACKAGE' },
      orderBy: { createdAt: 'desc' }
    });

    const redeemLogs = await this.prisma.auditLog.findMany({
      where: { userId: user.id, action: 'REDEEM_VOUCHER' },
      orderBy: { createdAt: 'desc' }
    });

    const activePackagesMap = new Set<string>();

    for (const log of buyLogs) {
      const vals = (log.newValues as any) || {};
      if (vals.packageId) {
        activePackagesMap.add(vals.packageId.toLowerCase());
      }
    }

    for (const log of redeemLogs) {
      const vals = (log.newValues as any) || {};
      if (vals.packageType) {
        activePackagesMap.add(vals.packageType.toLowerCase());
      }
    }

    const activePackages = Array.from(activePackagesMap);

    if (activePackages.length > 0) {
      let plan = 'Free Trial';
      const latestRedeem = redeemLogs[0];
      const latestBuy = buyLogs[0];

      if (latestRedeem) {
        const type = ((latestRedeem.newValues as any)?.packageType || '').toLowerCase();
        plan = type.includes('haj') ? 'Hajj Premium' : 'Umrah Premium';
      } else if (latestBuy) {
        const type = ((latestBuy.newValues as any)?.packageId || '').toLowerCase();
        plan = type.includes('haj') ? 'Hajj Premium' : 'Umrah Premium';
      }

      return {
        active: true,
        plan,
        activePackages,
        tenantId: user.tenantId,
        tenantName: user.tenant?.name || 'Biro Mitra'
      };
    }

    return {
      active: false,
      plan: 'Free Trial',
      activePackages: [],
      tenantId: user.tenantId,
      tenantName: user.tenant?.name || 'Biro Mitra'
    };
  }

  async buyPackage(body: { packageId: string }, user: any) {
    const { packageId } = body;
    if (!packageId) {
      throw new BadRequestException('packageId is required.');
    }

    const log = await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: 'BUY_PACKAGE',
        entityName: 'Tenant',
        entityId: user.tenantId,
        newValues: { packageId }
      }
    });

    await this.prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SUBSCRIPTION',
        title: 'Pembelian Paket Berhasil',
        message: `Paket ${packageId === 'hajj' ? 'Haji' : 'Umrah'} Premium Anda telah aktif. Silakan kunjungi menu Pembelajaran Saya.`
      }
    });

    return { success: true, log };
  }

  private async autoSeedHajjData() {
    try {
      console.log("AUTO-SEEDING REAL HAJJ DATA...");

      await this.prisma.learningContent.deleteMany();
      await this.prisma.lesson.deleteMany();
      await this.prisma.module.deleteMany();
      await this.prisma.learningPath.deleteMany();
      await this.prisma.product.deleteMany();

      const tenant = await this.prisma.tenant.findFirst({
        where: { name: 'Bahrain Virtual Academy' }
      });
      if (!tenant) return;

      const product = await this.prisma.product.create({
        data: {
          tenantId: tenant.id,
          title: 'Hajj & Umrah Preparation Portal',
          description: 'A comprehensive study path mapped to complete virtual readiness before departure.'
        }
      });

      const path = await this.prisma.learningPath.create({
        data: {
          productId: product.id,
          title: 'Haji 360 Premium Study Course',
          description: 'Interactive sequence for all mandatory steps in holy land.'
        }
      });

      const course = await this.prisma.course.create({
        data: {
          learningPathId: path.id,
          title: 'Haji 360 Full Course',
          description: 'Complete curriculum from flight guidelines to Makkah and Madinah guides.'
        }
      });

      const module1 = await this.prisma.module.create({
        data: {
          courseId: course.id,
          title: 'Preparation and Mandatory Rites (Rukun)',
          order: 0
        }
      });

      const lessonsData = [
        {
          title: 'Physical Readiness Protocols',
          type: 'READING',
          content: '## Persiapan Fisik & Kesehatan sebelum Berangkat\n\nJemaah dianjurkan melakukan olahraga ringan (seperti jalan kaki 3-5 km sehari) minimal 2 bulan sebelum keberangkatan. Pastikan melakukan vaksinasi wajib (Meningitis) dan vaksinasi anjuran (Influenza, Pneumonia).'
        },
        {
          title: 'Flight & Baggage Rules',
          type: 'READING',
          content: '## Aturan Penerbangan & Barang Bawaan\n\nBatas maksimal berat koper bagasi adalah 32 kg, dan tas kabin maksimal 7 kg. Jemaah dilarang membawa benda tajam, cairan melebihi 100ml di kabin, serta obat-obatan tanpa resep resmi dokter.'
        },
        {
          title: 'Ihram & Miqat Protocols',
          type: 'VIRTUAL_TOUR',
          content: 'https://v360.alamin-tour.com/miqat-yalamlam'
        },
        {
          title: 'Niat Haji & Larangan Ihram',
          type: 'READING',
          content: '## Niat Haji & Larangan Ihram\n\n*Niat Haji:* "Labaikallahumma Hajjan".\n\n*Larangan Ihram bagi Laki-laki:* memakai pakaian berjahit, memakai penutup kepala.\n*Larangan bagi Wanita:* menutup wajah (cadar) & telapak tangan.\n*Larangan Umum:* memakai wewangian, memotong kuku/rambut, dan berburu hewan.'
        },
        {
          title: 'Tawaf Al-Qudum (Arrival)',
          type: 'VIRTUAL_TOUR',
          content: 'https://v360.alamin-tour.com/tawaf-qudum'
        },
        {
          title: 'Sa\'i Hills Navigation',
          type: 'VIRTUAL_TOUR',
          content: 'https://v360.alamin-tour.com/sai-hills'
        },
        {
          title: 'Wukuf Day in Arafah',
          type: 'VIRTUAL_TOUR',
          content: 'https://v360.alamin-tour.com/arafah-camp'
        },
        {
          title: 'Muzdalifah Night Gathering',
          type: 'VIRTUAL_TOUR',
          content: 'https://v360.alamin-tour.com/muzdalifah'
        },
        {
          title: 'Mabit di Mina & Lempar Jumrah',
          type: 'READING',
          content: '## Mabit di Mina & Lempar Jumrah\n\nBermalam di Mina dan melempar tiga jumrah (Ula, Wustha, dan Aqabah) pada hari-hari Tasyrik (11, 12, dan 13 Zulhijah).'
        },
        {
          title: 'Tahalul Akhir',
          type: 'READING',
          content: '## Tahalul Akhir\n\nMencukur rambut kembali sebagai tanda telah selesai seluruh rangkaian ibadah dan terbebas dari semua larangan ihram.'
        },
        {
          title: 'Tawaf Wada (Perpisahan)',
          type: 'READING',
          content: '## Tawaf Wada (Perpisahan)\n\nTawaf terakhir yang dilakukan jemaah sebelum meninggalkan Kota Makkah.'
        }
      ];

      for (let i = 0; i < lessonsData.length; i++) {
        const data = lessonsData[i];
        const lesson = await this.prisma.lesson.create({
          data: {
            moduleId: module1.id,
            title: data.title,
            order: i
          }
        });

        await this.prisma.learningContent.create({
          data: {
            lessonId: lesson.id,
            type: data.type,
            title: 'Material Content',
            resourceUrl: data.content
          }
        });
      }

      await this.prisma.voucherPrice.upsert({
        where: { packageType: 'hajj' },
        update: { price: 100000 },
        create: { packageType: 'hajj', price: 100000 }
      });

      await this.prisma.voucherPrice.upsert({
        where: { packageType: 'umroh' },
        update: { price: 100000 },
        create: { packageType: 'umroh', price: 100000 }
      });
    } catch (e) {
      console.error("SEEDING ERROR:", e);
    }
  }
}
