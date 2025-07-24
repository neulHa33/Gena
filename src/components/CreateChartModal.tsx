'use client';

import React, { useState, useEffect } from 'react';
import { Chart } from '../types/dashboard';
import ChartPreview from './ChartPreview';

interface CreateChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (chart: Chart) => void;
}

const chartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: '📊' },
  { value: 'line', label: 'Line Chart', icon: '📈' },
  { value: 'pie', label: 'Pie Chart', icon: '🥧' },
  { value: 'doughnut', label: 'Doughnut Chart', icon: '🍩' },
  { value: 'scatter', label: 'Scatter Plot', icon: '🔵' },
  { value: 'radar', label: 'Radar Chart', icon: '🎯' },
  { value: 'polarArea', label: 'Polar Area', icon: '🌊' },
  { value: 'number', label: 'Number Display', icon: '🔢' },
];

const dataEndpoints = [
  { value: '/api/data/total_revenue', label: 'Total Revenue' },
  { value: '/api/data/orders_over_time', label: 'Orders Over Time' },
  { value: '/api/data/user_growth_by_month', label: 'User Growth by Month' },
  { value: '/api/data/conversion_rate_over_time', label: 'Conversion Rate Over Time' },
  { value: '/api/data/page_views_by_category', label: 'Page Views by Category' },
  { value: '/api/data/signups_by_region', label: 'Signups by Region' },
];

const colors = [
  '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa',
  '#fb923c', '#06b6d4', '#84cc16', '#f59e0b', '#ef4444'
];

const CreateChartModal: React.FC<CreateChartModalProps> = ({ isOpen, onClose, onSave }) => {
  const [chartType, setChartType] = useState<string>('bar');
  const [title, setTitle] = useState<string>('');
  const [dataEndpoint, setDataEndpoint] = useState<string>('/api/data/total_revenue');
  const [color, setColor] = useState<string>('#60a5fa');
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chart data when endpoint changes
  useEffect(() => {
    if (dataEndpoint) {
      loadChartData();
    }
  }, [dataEndpoint]);

  const loadChartData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(dataEndpoint);
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Failed to load chart data:', error);
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a chart title');
      return;
    }

    const newChart: Chart = {
      id: `chart-${Date.now()}`,
      dashboardId: 'temp',
      type: chartType as any,
      title: title.trim(),
      dataEndpoint,
      color,
    };

    onSave(newChart);
    onClose();
    
    // Reset form
    setChartType('bar');
    setTitle('');
    setDataEndpoint('/api/data/total_revenue');
    setColor('#60a5fa');
    setChartData(null);
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setChartType('bar');
    setTitle('');
    setDataEndpoint('/api/data/total_revenue');
    setColor('#60a5fa');
    setChartData(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Chart
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Chart Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Chart Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {chartTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setChartType(type.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        chartType === type.value
                          ? 'border-mint dark:border-pink bg-mint/10 dark:bg-pink/10'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="text-xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chart Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter chart title..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Data Endpoint Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Source
                </label>
                <select
                  value={dataEndpoint}
                  onChange={(e) => setDataEndpoint(e.target.value)}
                  className="w-full px-4 py-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {dataEndpoints.map((endpoint) => (
                    <option key={endpoint.value} value={endpoint.value}>
                      {endpoint.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chart Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => setColor(colorOption)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color === colorOption
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorOption }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-mint dark:bg-pink text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Create Chart
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview
                </h3>
                
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : chartData ? (
                  <div className="h-64">
                    <ChartPreview
                      type={chartType as any}
                      title={title || 'Chart Preview'}
                      data={chartData}
                      color={color}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <div>Select data source to see preview</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChartModal; 