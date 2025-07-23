'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Scatter, Radar, PolarArea } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartType } from '../types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
  ChartDataLabels
);

type ChartRendererProps = {
  type: ChartType;
  title: string;
  data: any;
  color?: string;
  fullscreen?: boolean;
};

const ChartRenderer = React.memo(({ type, title, data, color = '#72E9BF', fullscreen = false }: ChartRendererProps) => {
  // Memoize chart data and options to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    if (!data) return null;

    // Handle different data formats
    if (data.value !== undefined) {
      // Single value format (e.g., total revenue)
      return {
        labels: [data.label || 'Value'],
        datasets: [{
          data: [data.value],
          backgroundColor: [color],
          borderColor: [color],
          borderWidth: 1,
        }],
      };
    }

    if (data.labels && data.values) {
      // Labels and values format
      return {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: Array(data.values.length).fill(color),
          borderColor: Array(data.values.length).fill(color),
          borderWidth: 1,
        }],
      };
    }

    if (data.datasets) {
      // Full chart.js format
      return data;
    }

    return null;
  }, [data, color]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: type === 'pie' || type === 'doughnut',
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 12
        },
        formatter: (value: any, context: any) => {
          if (type === 'pie' || type === 'doughnut') {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          }
          return value;
        }
      }
    },
    scales: {
      x: {
        display: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea',
        grid: {
          display: false,
        },
      },
      y: {
        display: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea',
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: type === 'radar' ? 3 : 6,
        hoverRadius: type === 'radar' ? 5 : 8,
      },
    },
  }), [type]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  // Modify chart data for specific chart types
  const modifiedChartData = useMemo(() => {
    if (!chartData) return null;

    const baseData = { ...chartData };
    
    // Add transparency for Polar Area charts
    if (type === 'polarArea' && baseData.datasets) {
      baseData.datasets = baseData.datasets.map((dataset: any) => ({
        ...dataset,
        backgroundColor: Array.isArray(dataset.backgroundColor) 
          ? dataset.backgroundColor.map((color: string) => color + '80') // Add 50% transparency
          : dataset.backgroundColor + '80'
      }));
    }

    return baseData;
  }, [chartData, type]);

  return (
    <div className={`w-full h-full ${fullscreen ? 'h-screen' : 'h-64'}`}>
      {type === 'number' && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {chartData.datasets?.[0]?.data?.[0] || '0'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
          </div>
        </div>
      )}
      {type === 'bar' && <Bar data={modifiedChartData} options={chartOptions} />}
      {type === 'line' && <Line data={modifiedChartData} options={chartOptions} />}
      {type === 'pie' && <Pie data={modifiedChartData} options={chartOptions} />}
      {type === 'doughnut' && <Doughnut data={modifiedChartData} options={chartOptions} />}
      {type === 'scatter' && <Scatter data={modifiedChartData} options={chartOptions} />}
      {type === 'radar' && <Radar data={modifiedChartData} options={chartOptions} />}
      {type === 'polarArea' && <PolarArea data={modifiedChartData} options={chartOptions} />}
    </div>
  );
});

ChartRenderer.displayName = 'ChartRenderer';

export default ChartRenderer; 