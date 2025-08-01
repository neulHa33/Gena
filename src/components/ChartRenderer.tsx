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

// Dynamic color palette for charts
const colorPalette = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
  '#14B8A6', '#FBBF24', '#F87171', '#A78BFA', '#34D399'
];

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
      const isCircularChart = type === 'pie' || type === 'doughnut' || type === 'polarArea';
      
      if (isCircularChart) {
        // Use dynamic colors for circular charts
        const dynamicColors = data.values.map((_: any, index: number) => 
          colorPalette[index % colorPalette.length]
        );
        
        return {
          labels: data.labels,
          datasets: [{
            data: data.values,
            backgroundColor: dynamicColors,
            borderColor: dynamicColors,
            borderWidth: 1,
          }],
        };
      } else {
        // Use single color for bar, line, and other charts
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
    }

    if (data.datasets) {
      // Full chart.js format
      return data;
    }

    return null;
  }, [data, color, type]);

  const chartOptions = useMemo(() => {
    // Custom datalabels config for polarArea
    let polarAreaDatalabels = {};
    if (type === 'polarArea' && chartData && chartData.datasets && chartData.datasets[0]?.data) {
      const values = chartData.datasets[0].data;
      // Get indices of top 4 values
      const sorted = values
        .map((v: number, i: number) => ({ v, i }))
        .sort((a: { v: number; i: number }, b: { v: number; i: number }) => b.v - a.v);
      const showIndices = sorted.slice(0, 4).map((obj: { v: number; i: number }) => obj.i);
      polarAreaDatalabels = {
        display: (ctx: any) => showIndices.includes(ctx.dataIndex),
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 10
        },
        formatter: (value: any, context: any) => {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        }
      };
    }
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
        datalabels:
          type === 'polarArea'
            ? polarAreaDatalabels
            : {
                display: type === 'pie' || type === 'doughnut',
                color: '#fff',
                font: {
                  weight: 'bold' as const,
                  size: fullscreen ? 14 : 12
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
          ticks: {
            font: {
              size: (type === 'bar' || type === 'line' || type === 'area') ? 13 : (fullscreen ? 12 : 10),
              weight: (type === 'bar' || type === 'line' || type === 'area') ? 'bold' : 'normal'
            }
          }
        },
        y: {
          display: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea',
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: fullscreen ? 12 : 10
            }
          }
        },
        r: {
          display: type === 'radar',
          grid: {
            color: '#555',
            borderColor: '#555',
          },
          ticks: {
            color: '#ccc',
            font: {
              size: fullscreen ? 12 : 10
            },
            backdropColor: 'transparent'
          },
          pointLabels: {
            color: '#ccc',
            font: {
              size: fullscreen ? 12 : 10
            }
          }
        }
      },
      elements: {
        point: {
          radius: type === 'radar' ? (fullscreen ? 4 : 3) : (fullscreen ? 8 : 6),
          hoverRadius: type === 'radar' ? (fullscreen ? 6 : 5) : (fullscreen ? 10 : 8),
        },
        bar: {
          hoverBackgroundColor: (context: any) => {
            const color = context.raw.backgroundColor || context.raw.borderColor;
            if (color) {
              // Make the color darker for hover effect
              const hex = color.replace('#', '');
              const r = parseInt(hex.substr(0, 2), 16);
              const g = parseInt(hex.substr(2, 2), 16);
              const b = parseInt(hex.substr(4, 2), 16);
              const darkerR = Math.max(0, r - 40);
              const darkerG = Math.max(0, g - 40);
              const darkerB = Math.max(0, b - 40);
              return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
            }
            return color;
          },
        },
      },
    };

    return baseOptions;
  }, [type, fullscreen, chartData]);

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

    // Add fill styling for Area charts
    if (type === 'area' && baseData.datasets) {
      baseData.datasets = baseData.datasets.map((dataset: any) => ({
        ...dataset,
        fill: true,
        backgroundColor: Array.isArray(dataset.backgroundColor) 
          ? dataset.backgroundColor.map((color: string) => color + '40') // Add transparency for fill
          : dataset.backgroundColor + '40',
        borderColor: dataset.backgroundColor,
        borderWidth: 2,
        tension: 0.4
      }));
    }

    // Add custom styling for Radar charts
    if (type === 'radar' && baseData.datasets) {
      baseData.datasets = baseData.datasets.map((dataset: any) => ({
        ...dataset,
        backgroundColor: Array.isArray(dataset.backgroundColor) 
          ? dataset.backgroundColor.map((color: string) => color + '80') // Add 50% transparency
          : dataset.backgroundColor + '80',
        borderColor: dataset.backgroundColor,
        borderWidth: 0.5,
        pointRadius: 1,
        pointHoverRadius: 3,
        pointBackgroundColor: dataset.backgroundColor,
        pointBorderColor: dataset.backgroundColor,
        pointBorderWidth: 1,
        tension: 0.1
      }));
    }

    // Limit labels for circular charts to prevent overlap
    if ((type === 'pie' || type === 'doughnut' || type === 'polarArea') && baseData.labels && baseData.labels.length > 3) {
      const sortedData = baseData.labels.map((label: string, index: number) => ({
        label,
        value: baseData.datasets[0].data[index],
        color: baseData.datasets[0].backgroundColor[index]
      })).sort((a: any, b: any) => b.value - a.value);
      
      const top3 = sortedData.slice(0, 3);
      const others = sortedData.slice(3);
      const othersSum = others.reduce((sum: number, item: any) => sum + item.value, 0);
      
      if (othersSum > 0) {
        baseData.labels = [...top3.map((item: any) => item.label), 'Others'];
        baseData.datasets[0].data = [...top3.map((item: any) => item.value), othersSum];
        baseData.datasets[0].backgroundColor = [...top3.map((item: any) => item.color), '#9CA3AF'];
        baseData.datasets[0].borderColor = baseData.datasets[0].backgroundColor;
      }
    }

    return baseData;
  }, [chartData, type]);

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

  return (
    <div 
      className={`w-full ${fullscreen ? 'h-full' : 'h-full'}`} 
      style={{ 
        minHeight: fullscreen ? '200px' : '100%',
        maxWidth: fullscreen ? '90vw' : '100%',
        maxHeight: fullscreen ? '80vh' : '100%',
        height: '100%'
      }}
    >
      {type === 'number' && (
        <div className="flex items-center justify-center h-full">
          <div 
            className="text-center rounded-lg p-6"
            style={{ 
              backgroundColor: color + '33',
              minWidth: '200px'
            }}
          >
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {chartData.datasets?.[0]?.data?.[0] || '0'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
          </div>
        </div>
      )}
      {type === 'bar' && <Bar data={modifiedChartData} options={chartOptions as any} />}
      {type === 'line' && <Line data={modifiedChartData} options={chartOptions as any} />}
      {type === 'pie' && <Pie data={modifiedChartData} options={chartOptions as any} />}
      {type === 'doughnut' && <Doughnut data={modifiedChartData} options={chartOptions as any} />}
      {type === 'area' && <Line data={modifiedChartData} options={chartOptions as any} />}

      {type === 'radar' && <Radar data={modifiedChartData} options={chartOptions as any} />}
      {type === 'polarArea' && <PolarArea data={modifiedChartData} options={chartOptions as any} />}
    </div>
  );
});

ChartRenderer.displayName = 'ChartRenderer';

export default ChartRenderer; 