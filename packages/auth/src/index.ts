// Shared Authentication Utilities
export interface AuthSession {
  userId: string;
  tenantId: string;
  role: string;
}

export function validateSession(session: AuthSession): boolean {
  return !!session.userId && !!session.tenantId;
}
