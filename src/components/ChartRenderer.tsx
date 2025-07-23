import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartType } from '../types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartRendererProps = {
  type: ChartType;
  title: string;
  data: any;
  color?: string;
  fullscreen?: boolean;
};

export default function ChartRenderer({ type, title, data, color, fullscreen }: ChartRendererProps) {
  const chartColor = color || '#60a5fa';
  const containerClass = fullscreen
    ? 'bg-white dark:bg-gray-900 shadow rounded p-2 sm:p-6 flex flex-col items-center justify-center min-h-[300px] w-full h-full'
    : 'bg-white dark:bg-gray-800 shadow rounded p-6 flex flex-col items-center justify-center min-h-[120px] w-full';
  if (type === 'number') {
    return (
      <div className={containerClass}>
        <div className="text-gray-500 dark:text-gray-300 text-sm mb-2 text-center w-full">{title}</div>
        <div className="text-3xl font-bold text-center w-full">{data.value}</div>
      </div>
    );
  }
  if (type === 'bar') {
    return (
      <div className={containerClass}>
        <div className="text-gray-500 dark:text-gray-300 text-sm mb-2 text-center w-full">{title}</div>
        <Bar
          data={{
            labels: data.labels,
            datasets: [
              {
                label: title,
                data: data.values,
                backgroundColor: chartColor,
                borderRadius: 6,
                barPercentage: 0.7,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: '#f3f4f6' } },
            },
            maintainAspectRatio: !fullscreen,
          }}
        />
      </div>
    );
  }
  if (type === 'line') {
    return (
      <div className={containerClass}>
        <div className="text-gray-500 dark:text-gray-300 text-sm mb-2 text-center w-full">{title}</div>
        <Line
          data={{
            labels: data.labels,
            datasets: [
              {
                label: title,
                data: data.values,
                borderColor: chartColor,
                backgroundColor: chartColor + '22',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: '#f3f4f6' } },
            },
            maintainAspectRatio: !fullscreen,
          }}
        />
      </div>
    );
  }
  return null;
} 