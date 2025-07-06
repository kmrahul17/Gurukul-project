class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    this.token = localStorage.getItem('token');
  }

  private async refreshToken(): Promise<string> {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      throw new Error('No token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
    });

    if (!response.ok) {
      // Token refresh failed, clear storage and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/signin';
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    
    // Update stored token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.token = data.token;
    
    return data.token;
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.token || localStorage.getItem('token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers,
    });

    // If we get a 401 and have a token, try to refresh it
    if (response.status === 401 && token) {
      try {
        await this.refreshToken();
        
        // Retry the request with the new token
        headers['Authorization'] = `Bearer ${this.token}`;
        response = await fetch(`${this.baseURL}${url}`, {
          ...options,
          headers,
        });
      } catch (error) {
        // If refresh fails, don't retry and let the error propagate
        console.error('Token refresh failed:', error);
      }
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
    const token = this.token || localStorage.getItem('token');
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    // Handle token refresh for file uploads too
    if (response.status === 401 && token) {
      try {
        await this.refreshToken();
        headers['Authorization'] = `Bearer ${this.token}`;
        response = await fetch(`${this.baseURL}${url}`, {
          method: 'POST',
          headers,
          body: formData,
        });
      } catch (error) {
        console.error('Token refresh failed during file upload:', error);
      }
    }

    if (!response.ok) {
      throw new Error(`File upload to ${url} failed: ${response.statusText}`);
    }
    return response.json();
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;
