const API_BASE_URL = 'https://swot-backend.onrender.com/api';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SwotData {
  _id?: string;
  userId?: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SwotResponse {
  message: string;
  swot: SwotData;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async register(name: string, email: string, password: string, age: number): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, age }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  async createOrUpdateSwot(swotData: Partial<SwotData>): Promise<SwotResponse> {
    const response = await fetch(`${API_BASE_URL}/swot`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(swotData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save SWOT analysis');
    }

    return response.json();
  }

  async getSwot(): Promise<SwotResponse> {
    const response = await fetch(`${API_BASE_URL}/swot`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch SWOT analysis');
    }

    return response.json();
  }

  async updateSwotField(field: string, values: string[]): Promise<SwotResponse> {
    const response = await fetch(`${API_BASE_URL}/swot/${field}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ values }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update ${field}`);
    }

    return response.json();
  }

  async deleteSwot(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/swot`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete SWOT analysis');
    }

    return response.json();
  }
}

export const apiService = new ApiService();