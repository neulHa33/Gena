export type ChartType = 'number' | 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'horizontalBar' | 'radar' | 'polarArea';

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
  charts: Chart[];
  createdAt?: string;
  updatedAt?: string;
  description?: string;
}

// Grid layout types for react-grid-layout
export interface GridItem {
  i: string; // unique identifier
  x: number; // x position in grid
  y: number; // y position in grid
  w: number; // width in grid units
  h: number; // height in grid units
  minW?: number; // minimum width
  maxW?: number; // maximum width
  minH?: number; // minimum height
  maxH?: number; // maximum height
  static?: boolean; // if true, item cannot be moved or resized
  isDraggable?: boolean; // if false, item cannot be dragged
  isResizable?: boolean; // if false, item cannot be resized
}

// Layout template definition
export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // URL or component for preview
  layout: GridItem[]; // default grid layout
  cols: number; // number of columns in grid
  rowHeight: number; // height of each row in pixels
}

// Dashboard editor state
export interface DashboardEditorState {
  layout: GridItem[];
  charts: Chart[];
  selectedTemplate: LayoutTemplate | null;
  isEditing: boolean;
} 