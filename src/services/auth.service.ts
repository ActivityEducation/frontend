// src/services/auth.service.ts

const API_BASE_URL = 'http://localhost/api'; // IMPORTANT: Update this to your actual backend API URL

const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data; // Expected to return { access_token: string, user: any }
  },

  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data; // Expected to return { access_token: string, user: any }
  },
};

export default authService;
