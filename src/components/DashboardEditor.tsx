'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { GridItem, LayoutTemplate, Chart } from '../types/dashboard';
import { createLayoutFromTemplate } from '../lib/layoutTemplates';
import ChartRenderer from './ChartRenderer';
import CreateChartModal from './CreateChartModal';

// Responsive grid layout with width provider
const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardEditorProps {
  template: LayoutTemplate;
  onSave: (layout: GridItem[], charts: Chart[]) => void;
  onCancel: () => void;
}

const DashboardEditor: React.FC<DashboardEditorProps> = ({ 
  template, 
  onSave, 
  onCancel 
}) => {
  // State for layout and charts
  const [layout, setLayout] = useState<GridItem[]>([]);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [chartData, setChartData] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize layout from template
  useEffect(() => {
    const initialLayout = createLayoutFromTemplate(template);
    setLayout(initialLayout);
  }, [template]);

  // Handle layout changes
  const onLayoutChange = useCallback((newLayout: GridItem[]) => {
    setLayout(newLayout);
  }, []);

  // Load chart data
  const loadChartData = useCallback(async (chartId: string, dataEndpoint: string) => {
    try {
      const response = await fetch(dataEndpoint);
      const data = await response.json();
      setChartData(prev => ({ ...prev, [chartId]: data }));
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  }, []);

  // Add a new chart to the layout (quick add)
  const addChartQuick = useCallback(async (chartType: string, dataEndpoint: string) => {
    const newChart: Chart = {
      id: `chart-${Date.now()}`,
      dashboardId: 'temp',
      type: chartType as any,
      title: `New ${chartType} Chart`,
      dataEndpoint,
      color: '#60a5fa',
    };

    setCharts(prev => [...prev, newChart]);

    // Load chart data
    await loadChartData(newChart.id, dataEndpoint);

    // Find an empty slot in the layout
    const emptySlot = layout.find(item => !charts.find(chart => chart.id === item.i));
    if (emptySlot) {
      // Update the layout item to reference the new chart
      setLayout(prev => prev.map(item => 
        item.i === emptySlot.i ? { ...item, i: newChart.id } : item
      ));
    }
  }, [layout, charts, loadChartData]);

  // Add chart from modal
  const addChartFromModal = useCallback((chart: Chart) => {
    setCharts(prev => [...prev, chart]);

    // Load chart data
    loadChartData(chart.id, chart.dataEndpoint);

    // Find an empty slot in the layout
    const emptySlot = layout.find(item => !charts.find(c => c.id === item.i));
    if (emptySlot) {
      // Update the layout item to reference the new chart
      setLayout(prev => prev.map(item => 
        item.i === emptySlot.i ? { ...item, i: chart.id } : item
      ));
    }
  }, [layout, charts, loadChartData]);

  // Remove a chart
  const removeChart = useCallback((chartId: string) => {
    setCharts(prev => prev.filter(chart => chart.id !== chartId));
    setLayout(prev => prev.filter(item => item.i !== chartId));
    setChartData(prev => {
      const newData = { ...prev };
      delete newData[chartId];
      return newData;
    });
  }, []);

  // Save the dashboard
  const handleSave = useCallback(() => {
    onSave(layout, charts);
  }, [layout, charts, onSave]);

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  // Open modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Available data endpoints for quick chart creation
  const dataEndpoints = [
    { name: 'Total Revenue', endpoint: '/api/data/total_revenue' },
    { name: 'Orders Over Time', endpoint: '/api/data/orders_over_time' },
    { name: 'User Growth', endpoint: '/api/data/user_growth_by_month' },
    { name: 'Conversion Rate', endpoint: '/api/data/conversion_rate_over_time' },
    { name: 'Page Views', endpoint: '/api/data/page_views_by_category' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Editor Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard Editor
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Template: {template.name}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Edit Mode Toggle */}
              <button
                onClick={toggleEditMode}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {isEditing ? 'View Mode' : 'Edit Mode'}
              </button>
              
              {/* Cancel Button */}
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
              >
                Cancel
              </button>
              
              {/* Save Button */}
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="px-4 py-8">
        {/* Add Chart Section */}
        {isEditing && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Charts
              </h3>
              <button
                onClick={openModal}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                + Create Custom Chart
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {dataEndpoints.map((endpoint) => (
                <button
                  key={endpoint.endpoint}
                  onClick={() => addChartQuick('bar', endpoint.endpoint)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                >
                  + {endpoint.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid Layout */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: template.cols, md: template.cols, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={template.rowHeight}
            onLayoutChange={onLayoutChange}
            isDraggable={isEditing}
            isResizable={isEditing}
            margin={[16, 16]}
            containerPadding={[0, 0]}
          >
            {layout.map((item) => {
              const chart = charts.find(c => c.id === item.i);
              
              return (
                <div key={item.i} className="bg-gray-50 dark:bg-gray-700 rounded-lg relative">
                  {chart ? (
                    <div className="p-4 h-full">
                      <ChartRenderer
                        type={chart.type}
                        title={chart.title}
                        data={chartData[chart.id]}
                        color={chart.color}
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeChart(chart.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors z-10"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 h-full flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="text-center">
                        <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">+</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          Add Chart
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </div>
      </div>

      {/* Create Chart Modal */}
      <CreateChartModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={addChartFromModal}
      />
    </div>
  );
};

export default DashboardEditor; 