import { SolarPlant, Datapoint, DataReportRequest, DataUpdateRequest, DataUpdateResponse, ApiResponse } from '../types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const API_URL = 'http://localhost:5001';
let plantsCache: SolarPlant[] = [];
let isCacheValid = false;

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      return { error: errorData.message || `Error: ${response.status} ${response.statusText}` };
    } catch (e) {
      return { error: `Error: ${response.status} ${response.statusText}` };
    }
  }
  
  try {
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'Failed to parse response' };
  }
}

export const apiService = {
  getPlants: async (limit = 10, offset = 0, searchTerm = ''): Promise<ApiResponse<PaginatedResponse<SolarPlant>>> => {
    try {
      if (searchTerm && searchTerm.trim() !== '') {
        return await handleClientSideSearch(limit, offset, searchTerm);
      }
      
      let url = `${API_URL}/plants?limit=${limit}&offset=${offset}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Error fetching plants: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 200) + '...');
        throw new Error('Invalid response format: Expected JSON but received different content type');
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Failed to fetch plants:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch plants' 
      };
    }
  },
  
  getPlantById: async (uid: string): Promise<ApiResponse<SolarPlant>> => {
    try {
      const response = await fetch(`${API_URL}/plants/${uid}`);
      return handleResponse<SolarPlant>(response);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  },
  
  createPlant: async (plantData: { name: string }): Promise<ApiResponse<SolarPlant>> => {
    try {
      const response = await fetch(`${API_URL}/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plantData)
      });
      
      isCacheValid = false;
      
      return handleResponse<SolarPlant>(response);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  },
  
  deletePlant: async (uid: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await fetch(`${API_URL}/plants/${uid}`, {
        method: 'DELETE'
      });
      
      isCacheValid = false;
      
      if (response.status === 204) {
        return { data: true };
      }
      
      return handleResponse<boolean>(response);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  },
  
  updatePlant: async (uid: string, plantData: { name: string }): Promise<ApiResponse<SolarPlant>> => {
    try {
      const response = await fetch(`${API_URL}/plants/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plantData)
      });
      
      isCacheValid = false;
      
      return handleResponse<SolarPlant>(response);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
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
      
      const result = await handleResponse<PaginatedResponse<Datapoint>>(response);
      
      if (result.data) {
        return { data: result.data.results };
      }
      
      if (result.error) {
        return { error: result.error };
      }
      
      return { error: 'Unknown error' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
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
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }
};

async function handleClientSideSearch(
  limit: number, 
  offset: number, 
  searchTerm: string
): Promise<ApiResponse<PaginatedResponse<SolarPlant>>> {
  try {
    if (!isCacheValid) {
      const result = await refreshCache();
      if (!result) {
        return { 
          error: 'Failed to load plants for search' 
        };
      }
    }
    
    const lowerTerm = searchTerm.toLowerCase();
    const filteredPlants = plantsCache.filter(plant => 
      plant.name.toLowerCase().includes(lowerTerm) || 
      plant.uid.toLowerCase().includes(lowerTerm)
    );
    
    const totalCount = filteredPlants.length;
    const paginatedResults = filteredPlants.slice(offset, offset + limit);
    
    const hasNextPage = offset + limit < totalCount;
    const hasPrevPage = offset > 0;
    
    return {
      data: {
        count: totalCount,
        next: hasNextPage ? `${API_URL}/plants?limit=${limit}&offset=${offset + limit}&search=${encodeURIComponent(searchTerm)}` : null,
        previous: hasPrevPage ? `${API_URL}/plants?limit=${limit}&offset=${Math.max(0, offset - limit)}&search=${encodeURIComponent(searchTerm)}` : null,
        results: paginatedResults
      }
    };
  } catch (error) {
    console.error('Error performing client-side search:', error);
    return {
      error: error instanceof Error ? error.message : 'Error performing search'
    };
  }
}

async function refreshCache(): Promise<boolean> {
  try {
    const url = `${API_URL}/plants?limit=1000&offset=0`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Failed to refresh cache:', response.statusText);
      return false;
    }
    
    const data = await response.json();
    
    if (data && 'results' in data && Array.isArray(data.results)) {
      plantsCache = data.results;
      isCacheValid = true;
      return true;
    } else if (Array.isArray(data)) {
      plantsCache = data;
      isCacheValid = true;
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}