const prisma = require('../../config/prisma');

const getAllModules = async (req, res, next) => {
  try {
    const modules = await prisma.vRModule.findMany({
      include: { _count: { select: { scenes: true } } }
    });
    res.json({ status: 'success', data: modules });
  } catch (error) {
    next(error);
  }
};

const createModule = async (req, res, next) => {
  try {
    const { name, description, thumbnail } = req.body;
    const module = await prisma.vRModule.create({
      data: { name, description, thumbnail }
    });
    res.status(201).json({ status: 'success', data: module });
  } catch (error) {
    next(error);
  }
};

const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 1. Find all scenes in this module
    const scenes = await prisma.vRScene.findMany({ where: { moduleId: id } });
    const sceneIds = scenes.map(s => s.id);

    // 2. Delete all hotspots related to these scenes (as source or target)
    await prisma.vRHotspot.deleteMany({
      where: {
        OR: [
          { sceneId: { in: sceneIds } },
          { targetSceneId: { in: sceneIds } }
        ]
      }
    });

    // 3. Delete all scenes
    await prisma.vRScene.deleteMany({ where: { moduleId: id } });

    // 4. Finally delete the module
    await prisma.vRModule.delete({ where: { id } });

    res.json({ status: 'success', message: 'Modul dan seluruh aset di dalamnya berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

const getAllScenes = async (req, res, next) => {
  try {
    const { moduleId } = req.query;
    const scenes = await prisma.vRScene.findMany({
      where: moduleId ? { moduleId } : {},
      include: {
        hotspots: {
          include: {
            targetScene: true
          }
        },
        module: true
      }
    });
    res.json({ status: 'success', data: scenes });
  } catch (error) {
    next(error);
  }
};

const getTourConfig = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const scenes = await prisma.vRScene.findMany({
      where: moduleId ? { moduleId } : {},
      include: {
        hotspots: {
          include: {
            targetScene: true
          }
        }
      }
    });

    if (scenes.length === 0) {
        return res.status(404).json({ status: 'error', message: 'No scenes found for this module' });
    }

    // Format for Pannellum
    const config = {
      default: {
        firstScene: scenes.find(s => s.isFirst)?.id || scenes[0]?.id,
        author: "Manasik360",
        sceneFadeDuration: 1000,
        autoLoad: true,
        type: "equirectangular",
        haov: 360,
        vaov: 180,
        hfov: 100
      },
      scenes: {}
    };

    scenes.forEach(scene => {
      config.scenes[scene.id] = {
        title: scene.name,
        panorama: scene.panoramaPath.startsWith('http') ? scene.panoramaPath : `http://localhost:5001${scene.panoramaPath}`,
        type: "equirectangular",
        hotSpots: scene.hotspots.map(hs => ({
          pitch: hs.pitch,
          yaw: hs.yaw,
          type: "scene",
          text: hs.text,
          sceneId: hs.targetSceneId,
          cssClass: "custom-vr-arrow"
        }))
      };
    });

    res.json({ status: 'success', data: config });
  } catch (error) {
    next(error);
  }
};

const createScene = async (req, res, next) => {
  try {
    const { name, panoramaPath, isFirst, moduleId } = req.body;
    
    if (isFirst && moduleId) {
      // Unset other first scenes IN THE SAME MODULE
      await prisma.vRScene.updateMany({
        where: { isFirst: true, moduleId },
        data: { isFirst: false }
      });
    }

    const scene = await prisma.vRScene.create({
      data: { name, panoramaPath, isFirst: !!isFirst, moduleId }
    });
    res.status(201).json({ status: 'success', data: scene });
  } catch (error) {
    next(error);
  }
};

const addHotspot = async (req, res, next) => {
  try {
    const { sceneId, targetSceneId, pitch, yaw, text } = req.body;
    const hotspot = await prisma.vRHotspot.create({
      data: {
        sceneId,
        targetSceneId,
        pitch: parseFloat(pitch),
        yaw: parseFloat(yaw),
        text
      }
    });
    res.status(201).json({ status: 'success', data: hotspot });
  } catch (error) {
    next(error);
  }
};

const deleteScene = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Delete hotspots where this scene is source OR target
    await prisma.vRHotspot.deleteMany({
      where: {
        OR: [
          { sceneId: id },
          { targetSceneId: id }
        ]
      }
    });

    await prisma.vRScene.delete({ where: { id } });
    res.json({ status: 'success', message: 'Titik VR berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllModules,
  createModule,
  deleteModule,
  getAllScenes,
  getTourConfig,
  createScene,
  addHotspot,
  deleteScene
};
