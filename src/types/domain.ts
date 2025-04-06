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

export interface ChartDataPoint {
    day: string;
    expected: number;
    observed: number;
    date?: Date;
}