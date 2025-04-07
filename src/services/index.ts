import { mockApiService } from './mockService';
import { apiService } from './apiService';

const USE_MOCK_API = false;

export const service = USE_MOCK_API ? mockApiService : apiService;