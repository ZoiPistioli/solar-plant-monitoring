import { Plant, Datapoint } from './domain';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface DataReportRequest {
  plant_id: string; 
  date: string; 
}

export interface DataUpdateRequest {
  from_date: string;
  to_date: string;  
  plant_id: string;  
}

export interface CreatePlantRequest {
  name: string;     
}

export interface DataUpdateResponse {
  ok: boolean;
}

export type PlantListResponse = Plant[];
export type PlantResponse = Plant;
export type DatapointListResponse = Datapoint[];