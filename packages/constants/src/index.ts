// Shared System Business Constants

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  LEARNER: 'LEARNER'
} as const;

export const CONTENT_TYPES = {
  READING: 'READING',
  IMAGE: 'IMAGE',
  INFOGRAPHIC: 'INFOGRAPHIC',
  VIDEO: 'VIDEO',
  VIRTUAL_TOUR: 'VIRTUAL_TOUR',
  QUIZ: 'QUIZ',
  PDF: 'PDF',
  EXTERNAL_LINK: 'EXTERNAL_LINK'
} as const;

export const DEFAULT_THEME = {
  primary: '#064e3b',
  accent: '#d97706'
} as const;
