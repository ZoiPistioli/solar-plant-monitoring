import { SolarPlant, Datapoint, DataReportRequest, DataUpdateRequest, DataUpdateResponse, ApiResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

const getInitialPlants = (): SolarPlant[] => {
  const storedPlants = localStorage.getItem('mockPlants');
  if (storedPlants) {
    return JSON.parse(storedPlants);
  }

  const initialPlants: SolarPlant[] = [
    { uid: uuidv4(), name: 'Solar Plant Alpha' },
    { uid: uuidv4(), name: 'Solar Plant Beta' },
    { uid: uuidv4(), name: 'Solar Plant Gamma' },
    { uid: uuidv4(), name: 'Solar Plant Delta' },
    { uid: uuidv4(), name: 'Solar Plant Epsilon' },
    { uid: uuidv4(), name: 'Solar Plant Zeta' },
    { uid: uuidv4(), name: 'Solar Plant Eta' },
    { uid: uuidv4(), name: 'Solar Plant Theta' },
    { uid: uuidv4(), name: 'Solar Plant Iota' },
    { uid: uuidv4(), name: 'Solar Plant Kappa' },
    { uid: uuidv4(), name: 'Solar Plant Lambda' },
    { uid: uuidv4(), name: 'Solar Plant Mu' },
    { uid: uuidv4(), name: 'Solar Plant Nu' },
    { uid: uuidv4(), name: 'Solar Plant Xi' },
    { uid: uuidv4(), name: 'Solar Plant Omicron' },
    { uid: uuidv4(), name: 'Solar Plant Pi' },
    { uid: uuidv4(), name: 'Solar Plant Rho' },
    { uid: uuidv4(), name: 'Solar Plant Sigma' },
    { uid: uuidv4(), name: 'Solar Plant Tau' },
    { uid: uuidv4(), name: 'Solar Plant Upsilon' },
    { uid: uuidv4(), name: 'Solar Plant Phi' }
  ];

  localStorage.setItem('mockPlants', JSON.stringify(initialPlants));
  return initialPlants;
};

let mockPlants: SolarPlant[] = getInitialPlants();

const generateRandomDatapoint = (day: string): Datapoint => {
  return {
    day,
    total_energy_expected: Math.random() * 1500 + 800,
    total_energy_observed: Math.random() * 1500 + 800,
    total_irradiation_expected: Math.random() * 1500 + 800,
    total_irradiation_observed: Math.random() * 1500 + 800
  };
};

const generateMonthDatapoints = (date: string): Datapoint[] => {
  const yearMonth = date.substring(0, 7);
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(5, 7)) - 1;
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const datapoints: Datapoint[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${yearMonth}-${day.toString().padStart(2, '0')}`;
    datapoints.push(generateRandomDatapoint(dateString));
  }
  
  return datapoints;
};

export const mockApiService = {
  getPlants: async (): Promise<ApiResponse<SolarPlant[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...mockPlants] });
      }, 500); // Simulate network delay
    });
  },
  
  getPlantById: async (id: string): Promise<ApiResponse<SolarPlant>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plant = mockPlants.find(p => p.uid === id);
        if (plant) {
          resolve({ data: plant });
        } else {
          resolve({ error: 'Plant not found' });
        }
      }, 500);
    });
  },
  
  createPlant: async (plantData: { name: string }): Promise<ApiResponse<SolarPlant>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPlant: SolarPlant = {
          uid: uuidv4(),
          name: plantData.name
        };
        mockPlants.push(newPlant);
        localStorage.setItem('mockPlants', JSON.stringify(mockPlants));
        resolve({ data: newPlant });
      }, 500);
    });
  },
  
  updatePlant: async (id: string, plantData: { name: string }): Promise<ApiResponse<SolarPlant>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockPlants.findIndex(p => p.uid === id);
        if (index !== -1) {
          mockPlants[index] = { ...mockPlants[index], ...plantData };
          localStorage.setItem('mockPlants', JSON.stringify(mockPlants));
          resolve({ data: mockPlants[index] });
        } else {
          resolve({ error: 'Plant not found' });
        }
      }, 500);
    });
  },
  
  deletePlant: async (id: string): Promise<ApiResponse<boolean>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockPlants.findIndex(p => p.uid === id);
        if (index !== -1) {
          mockPlants.splice(index, 1);
          localStorage.setItem('mockPlants', JSON.stringify(mockPlants));
          resolve({ data: true });
        } else {
          resolve({ error: 'Plant not found' });
        }
      }, 500);
    });
  },
  
  getDataReport: async (params: DataReportRequest): Promise<ApiResponse<Datapoint[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plant = mockPlants.find(p => p.uid === params.plant_id);
        if (!plant) {
          resolve({ error: 'Plant not found' });
          return;
        }
        
        const datapoints = generateMonthDatapoints(params.date);
        resolve({ data: datapoints });
      }, 700);
    });
  },
  
  updateData: async (params: DataUpdateRequest): Promise<ApiResponse<DataUpdateResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plant = mockPlants.find(p => p.uid === params.plant_id);
        if (!plant) {
          resolve({ error: 'Plant not found' });
          return;
        }
        
        if (new Date(params.from_date) > new Date(params.to_date)) {
          resolve({ error: 'From date must be less than or equal to to date' });
          return;
        }
        
        resolve({ data: { ok: true } });
      }, 1000);
    });
  }
};