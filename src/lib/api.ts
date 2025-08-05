/**
 * Zynx AGI API Service
 * Handles communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface HealthResponse {
  status: string;
  message: string;
  version: string;
}

export interface CulturalContext {
  thai_culture: {
    greeting: string;
    respect_levels: string[];
    cultural_values: string[];
  };
  global_culture: {
    diversity: boolean;
    inclusivity: boolean;
    ethical_ai: boolean;
  };
  agi_considerations: {
    cultural_sensitivity: boolean;
    language_adaptation: boolean;
    ethical_boundaries: boolean;
  };
}

export interface InteractionRequest {
  message: string;
  cultural_context?: string;
  language?: string;
}

export interface AGIResponse {
  message: string;
  cultural_context: Record<string, any>;
  ethical_considerations: Record<string, any>;
}

class APIService {
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

  /**
   * Health check endpoint
   */
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  /**
   * Get cultural context for AGI interactions
   */
  async getCulturalContext(): Promise<CulturalContext> {
    return this.request<CulturalContext>('/api/v1/agi/context');
  }

  /**
   * Interact with the AGI system
   */
  async interactWithAGI(request: InteractionRequest): Promise<AGIResponse> {
    return this.request<AGIResponse>('/api/v1/agi/interact', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getHealth();
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const apiService = new APIService();

// Export the class for testing
export { APIService };