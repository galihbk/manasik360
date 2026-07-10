// Shared Domain Types

export interface Tenant {
  id: string;
  name: string;
  primaryColor?: string;
  logoUrl?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'LEARNER';
  tenantId: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tenantId: string;
}

export interface VirtualTour {
  id: string;
  title: string;
  packageUrl: string; // 3DVista folder endpoint
  tenantId: string;
}
