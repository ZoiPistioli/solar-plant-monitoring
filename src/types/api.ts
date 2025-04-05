export interface Plant {
  id: string;
  name: string;
}

export interface Datapoint {
  day: string;
  total_energy_expected: number;
  total_energy_observed: number;
  total_irradiation_expected: number;
  total_irradiation_observed: number;
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

export interface DataUpdateResponse {
  ok: boolean;
}