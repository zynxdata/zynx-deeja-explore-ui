/**
 * Zynx AGI API Service
 * Handles communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AGIRequest {
  prompt: string;
  cultural_context?: string;
  ethical_framework?: string;
}

export interface AGIResponse {
  response: string;
  cultural_notes: string;
  ethical_considerations: string;
  confidence_score: number;
}

export interface HealthResponse {
  status: string;
  message: string;
  version: string;
  timestamp: string;
}

export interface AGICapabilities {
  capabilities: string[];
  supported_cultures: string[];
  ethical_frameworks: string[];
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
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${error}`);
      throw error;
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  /**
   * Process AGI request
   */
  async processAGIRequest(request: AGIRequest): Promise<AGIResponse> {
    return this.request<AGIResponse>('/api/v1/agi/process', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get AGI capabilities
   */
  async getAGICapabilities(): Promise<AGICapabilities> {
    return this.request<AGICapabilities>('/api/v1/agi/capabilities');
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const apiService = new APIService();

// Export types for use in components
export type { AGIRequest, AGIResponse, HealthResponse, AGICapabilities };