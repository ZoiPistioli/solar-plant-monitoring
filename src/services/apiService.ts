import { Plant, Datapoint, DataReportRequest, DataUpdateRequest, DataUpdateResponse, ApiResponse } from '../types';

const API_URL = 'http://localhost:5001';

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return { 
      error: errorData.message || `Error: ${response.status} ${response.statusText}` 
    };
  }
  
  try {
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'Failed to parse response' };
  }
}

export const apiService = {
  getPlants: async (): Promise<ApiResponse<Plant[]>> => {
    try {
      const response = await fetch(`${API_URL}/plants`);
      return handleResponse<Plant[]>(response);
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  },
  
  getPlantById: async (id: string): Promise<ApiResponse<Plant>> => {
    try {
      const response = await fetch(`${API_URL}/plants/${id}`);
      return handleResponse<Plant>(response);
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  },
  
  createPlant: async (plantData: { name: string }): Promise<ApiResponse<Plant>> => {
    try {
      const response = await fetch(`${API_URL}/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plantData)
      });
      return handleResponse<Plant>(response);
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  },
  
  deletePlant: async (id: string): Promise<ApiResponse<boolean>> => {
    return new Promise((resolve) => {
      resolve({ data: true });
    });
  },
  
  updatePlant: async (id: string, plantData: { name: string }): Promise<ApiResponse<Plant>> => {
    return new Promise((resolve) => {
      resolve({ data: { id, name: plantData.name } });
    });
  },
  
  getDataReport: async (params: DataReportRequest): Promise<ApiResponse<Datapoint[]>> => {
    try {
      const response = await fetch(`${API_URL}/datapoints/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      return handleResponse<Datapoint[]>(response);
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  },
  
  updateData: async (params: DataUpdateRequest): Promise<ApiResponse<DataUpdateResponse>> => {
    try {
      const response = await fetch(`${API_URL}/datapoints/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      return handleResponse<DataUpdateResponse>(response);
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }
};