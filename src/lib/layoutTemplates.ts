import { LayoutTemplate } from '../types/dashboard';

// Define 5 different layout templates for users to choose from
export const layoutTemplates: LayoutTemplate[] = [
  {
    id: 'single-column',
    name: 'Single Column',
    description: 'Perfect for focused dashboards with one main metric per row',
    preview: '/templates/single-column.png',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 2 },
      { i: 'chart-2', x: 0, y: 4, w: 12, h: 4, minW: 6, minH: 2 },
      { i: 'chart-3', x: 0, y: 8, w: 12, h: 4, minW: 6, minH: 2 },
      { i: 'chart-4', x: 0, y: 12, w: 12, h: 4, minW: 6, minH: 2 },
    ],
    cols: 12,
    rowHeight: 100,
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Balanced layout with two charts side by side',
    preview: '/templates/two-column.png',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 2 },
      { i: 'chart-2', x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 2 },
      { i: 'chart-3', x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 2 },
      { i: 'chart-4', x: 6, y: 4, w: 6, h: 4, minW: 4, minH: 2 },
    ],
    cols: 12,
    rowHeight: 100,
  },
  {
    id: 'three-column',
    name: 'Three Column',
    description: 'Compact layout with three charts per row',
    preview: '/templates/three-column.png',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 4, h: 4, minW: 3, minH: 2 },
      { i: 'chart-2', x: 4, y: 0, w: 4, h: 4, minW: 3, minH: 2 },
      { i: 'chart-3', x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 2 },
      { i: 'chart-4', x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 2 },
      { i: 'chart-5', x: 6, y: 4, w: 6, h: 4, minW: 4, minH: 2 },
    ],
    cols: 12,
    rowHeight: 100,
  },
  {
    id: 'hero-layout',
    name: 'Hero Layout',
    description: 'Prominent main chart with supporting metrics below',
    preview: '/templates/hero-layout.png',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 12, h: 6, minW: 8, minH: 4 },
      { i: 'chart-2', x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 2 },
      { i: 'chart-3', x: 4, y: 6, w: 4, h: 4, minW: 3, minH: 2 },
      { i: 'chart-4', x: 8, y: 6, w: 4, h: 4, minW: 3, minH: 2 },
    ],
    cols: 12,
    rowHeight: 100,
  },
  {
    id: 'grid-layout',
    name: 'Grid Layout',
    description: 'Flexible grid with equal-sized chart blocks',
    preview: '/templates/grid-layout.png',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 2 },
      { i: 'chart-2', x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 2 },
      { i: 'chart-3', x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 2 },
      { i: 'chart-4', x: 6, y: 4, w: 6, h: 4, minW: 4, minH: 2 },
      { i: 'chart-5', x: 0, y: 8, w: 6, h: 4, minW: 4, minH: 2 },
      { i: 'chart-6', x: 6, y: 8, w: 6, h: 4, minW: 4, minH: 2 },
    ],
    cols: 12,
    rowHeight: 100,
  },
];

// Helper function to get template by ID
export const getTemplateById = (id: string): LayoutTemplate | undefined => {
  return layoutTemplates.find(template => template.id === id);
};

// Helper function to create a new layout from template
export const createLayoutFromTemplate = (template: LayoutTemplate): LayoutTemplate['layout'] => {
  return template.layout.map(item => ({ ...item }));
}; 