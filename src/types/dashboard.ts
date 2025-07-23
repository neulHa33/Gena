export type ChartType = 'number' | 'bar' | 'line';

export interface Chart {
  id: string;
  dashboardId: string;
  type: ChartType;
  title: string;
  dataEndpoint: string;
  color?: string;
}

export interface Dashboard {
  id: string;
  name: string;
  chartIds: string[];
} 