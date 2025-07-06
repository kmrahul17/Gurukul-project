class AdminApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    this.token = localStorage.getItem('adminToken');
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.token || localStorage.getItem('adminToken');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token && token !== 'mock-admin-token') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers,
    });

    // For admin panel, if we get a 401, redirect to login
    if (response.status === 401) {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    return response;
  }

  async get(url: string): Promise<any> {
    const response = await this.makeRequest(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`GET ${url} failed: ${response.statusText}`);
    }
    return response.json();
  }

  async post(url: string, data?: any): Promise<any> {
    const response = await this.makeRequest(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      throw new Error(`POST ${url} failed: ${response.statusText}`);
    }
    return response.json();
  }

  async put(url: string, data?: any): Promise<any> {
    const response = await this.makeRequest(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      throw new Error(`PUT ${url} failed: ${response.statusText}`);
    }
    return response.json();
  }

  async delete(url: string): Promise<any> {
    const response = await this.makeRequest(url, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`DELETE ${url} failed: ${response.statusText}`);
    }
    return response.json();
  }

  // Upload file with form data
  async uploadFile(url: string, formData: FormData): Promise<any> {
    const token = this.token || localStorage.getItem('adminToken');
    
    const headers: Record<string, string> = {};
    if (token && token !== 'mock-admin-token') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      throw new Error(`File upload to ${url} failed: ${response.statusText}`);
    }
    return response.json();
  }
}

// Create a singleton instance
const adminApiService = new AdminApiService();
export default adminApiService;
