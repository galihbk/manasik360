// Shared API client placeholders

export interface ApiClientConfig {
  baseUrl: string;
  token?: string;
}

export class ApiClient {
  constructor(private config: ApiClientConfig) {}

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (typeof window !== 'undefined') {
      const userName = localStorage.getItem('bahrain_user_name');
      const userEmail = localStorage.getItem('bahrain_user_email');
      const orgName = localStorage.getItem('bahrain_org_name');
      const userRole = localStorage.getItem('bahrain_user_role');
      if (userName) headers['x-user-name'] = userName;
      if (userEmail) headers['x-user-email'] = userEmail;
      if (orgName) headers['x-user-org'] = orgName;
      if (userRole) headers['x-user-role'] = userRole;
    }
    return headers;
  }

  async getHealth() {
    const res = await fetch(`${this.config.baseUrl}/health`);
    return res.json();
  }

  async getPaths() {
    const res = await fetch(`${this.config.baseUrl}/learning/paths`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async completeLesson(lessonId: string) {
    const res = await fetch(`${this.config.baseUrl}/learning/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  }

  async saveLessonProgress(lessonId: string, activeTab: string, maxUnlockedStep: number, quizAnswers?: any, quizScore?: number | null) {
    const res = await fetch(`${this.config.baseUrl}/learning/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ activeTab, maxUnlockedStep, quizAnswers, quizScore })
    });
    return res.json();
  }

  async redeemVoucher(code: string) {
    const res = await fetch(`${this.config.baseUrl}/learning/vouchers/redeem`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code })
    });
    return res.json();
  }

  async getProfile() {
    const res = await fetch(`${this.config.baseUrl}/learning/profile`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async updateProfile(data: { phone?: string; passportNumber?: string; address?: string; bio?: string }) {
    const res = await fetch(`${this.config.baseUrl}/learning/profile`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async getCertificates() {
    const res = await fetch(`${this.config.baseUrl}/learning/certificates`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getNotifications() {
    const res = await fetch(`${this.config.baseUrl}/learning/notifications`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getSubscription() {
    const res = await fetch(`${this.config.baseUrl}/learning/subscription`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async buyPackage(packageId: string) {
    const res = await fetch(`${this.config.baseUrl}/learning/subscription/buy`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ packageId })
    });
    return res.json();
  }

  async getOrgDashboard() {
    const res = await fetch(`${this.config.baseUrl}/learning/org-dashboard`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getVoucherPrices() {
    const res = await fetch(`${this.config.baseUrl}/learning/vouchers/prices`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async createVoucher(data: { code?: string; maxUses?: number; description?: string; packageType?: 'hajj' | 'umroh'; isPaid?: boolean }) {
    const res = await fetch(`${this.config.baseUrl}/learning/vouchers`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async deleteVoucher(code: string) {
    const res = await fetch(`${this.config.baseUrl}/learning/vouchers/${encodeURIComponent(code)}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getSingleVoucher(id: string) {
    const res = await fetch(`${this.config.baseUrl}/learning/vouchers/${encodeURIComponent(id)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async confirmVoucherPayment(id: string) {
    const res = await fetch(`${this.config.baseUrl}/learning/vouchers/${encodeURIComponent(id)}/confirm-payment`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  }

  // --- SUPER ADMIN METHODS ---

  async getSuperAdminStats() {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/stats`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getSuperAdminTenants() {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/tenants`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getSuperAdminVouchers() {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/vouchers`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getSuperAdminUsers() {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/users`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async updateSuperAdminVoucherPrice(packageType: string, price: number) {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/vouchers/prices`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ packageType, price })
    });
    return res.json();
  }

  async createSuperAdminTenant(data: { name: string; adminEmail: string; adminName: string }) {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/tenants`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // --- BLOG MANAGEMENT METHODS ---

  async getPublicBlogs() {
    const res = await fetch(`${this.config.baseUrl}/blogs/public`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getPublicBlog(id: string) {
    const res = await fetch(`${this.config.baseUrl}/blogs/public/${encodeURIComponent(id)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getSuperAdminBlogs() {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/blogs`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async createSuperAdminBlog(data: { title: string; content: string; published?: boolean }) {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/blogs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async updateSuperAdminBlog(id: string, data: { title?: string; content?: string; published?: boolean }) {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/blogs/${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async deleteSuperAdminBlog(id: string) {
    const res = await fetch(`${this.config.baseUrl}/learning/super-admin/blogs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.json();
  }

  // --- CHAT API METHODS ---

  async getChatConversations() {
    const res = await fetch(`${this.config.baseUrl}/chat/conversations`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async getChatMessages(contactId: string) {
    const res = await fetch(`${this.config.baseUrl}/chat/messages/${encodeURIComponent(contactId)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  async sendChatMessage(recipientId: string, message: string) {
    const res = await fetch(`${this.config.baseUrl}/chat/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ recipientId, message })
    });
    return res.json();
  }
}


