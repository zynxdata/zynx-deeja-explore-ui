/**
 * API Client for Zynx AGI Backend
 * Handles communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AGIResponse {
  message: string;
  cultural_context: {
    thai_culture: {
      respect: string;
      harmony: string;
      community: string;
    };
    global_perspectives: string[];
  };
  ethical_considerations: {
    privacy: string;
    transparency: string;
    fairness: string;
    accountability: string;
  };
}

export interface DeejaResponse {
  name: string;
  role: string;
  personality: {
    culturally_aware: boolean;
    empathetic: boolean;
    ethical: boolean;
    multilingual: boolean;
  };
  capabilities: string[];
  greeting: {
    thai: string;
    english: string;
    meaning: string;
  };
}

export interface HealthResponse {
  status: string;
  message: string;
  version: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async getAGIInfo(): Promise<AGIResponse> {
    return this.request<AGIResponse>('/api/v1/agi');
  }

  async meetDeeja(): Promise<DeejaResponse> {
    return this.request<DeejaResponse>('/api/v1/deeja');
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export individual functions for convenience
export const getHealth = () => apiClient.getHealth();
export const getAGIInfo = () => apiClient.getAGIInfo();
export const meetDeeja = () => apiClient.meetDeeja();