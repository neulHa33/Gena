'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DarkModeToggle from '../../../components/DarkModeToggle';

interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  layout: Array<{
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  preview: string;
}

const layoutTemplates: LayoutTemplate[] = [
  {
    id: 'single',
    name: 'Single Chart',
    description: 'Perfect for displaying one key metric',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 12, h: 8 }
    ],
    preview: '📊'
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Compare two metrics side by side',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 6, h: 6 },
      { i: 'chart-2', x: 6, y: 0, w: 6, h: 6 }
    ],
    preview: '📊📈'
  },
  {
    id: 'three-column',
    name: 'Three Column',
    description: 'Display three key metrics',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 4, h: 6 },
      { i: 'chart-2', x: 4, y: 0, w: 4, h: 6 },
      { i: 'chart-3', x: 8, y: 0, w: 4, h: 6 }
    ],
    preview: '📊📈📉'
  },
  {
    id: 'grid-2x2',
    name: '2x2 Grid',
    description: 'Four charts in a grid layout',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 6, h: 6 },
      { i: 'chart-2', x: 6, y: 0, w: 6, h: 6 },
      { i: 'chart-3', x: 0, y: 6, w: 6, h: 6 },
      { i: 'chart-4', x: 6, y: 6, w: 6, h: 6 }
    ],
    preview: '📊📈\n📉📊'
  },
  {
    id: 'main-sidebar',
    name: 'Main + Sidebar',
    description: 'Large main chart with sidebar metrics',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 8, h: 8 },
      { i: 'chart-2', x: 8, y: 0, w: 4, h: 4 },
      { i: 'chart-3', x: 8, y: 4, w: 4, h: 4 }
    ],
    preview: '📊📈\n📊📉'
  },
  {
    id: 'dashboard',
    name: 'Full Dashboard',
    description: 'Comprehensive layout with multiple charts',
    layout: [
      { i: 'chart-1', x: 0, y: 0, w: 4, h: 4 },
      { i: 'chart-2', x: 4, y: 0, w: 4, h: 4 },
      { i: 'chart-3', x: 8, y: 0, w: 4, h: 4 },
      { i: 'chart-4', x: 0, y: 4, w: 6, h: 6 },
      { i: 'chart-5', x: 6, y: 4, w: 6, h: 6 }
    ],
    preview: '📊📈📉\n📊📊'
  }
];

export default function CreateDashboardPage() {
  const router = useRouter();
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString();
  });

  const handleCreateDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashboardName.trim()) {
      alert('Please enter a dashboard name');
      return;
    }
    setIsCreating(true);
    try {
      // Create new dashboard via API
      const response = await fetch('/api/dashboards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: dashboardName.trim(),
          description: dashboardDescription.trim(),
          createdAt: new Date().toISOString(),
          charts: [],
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create dashboard');
      }
      const newDashboard = await response.json();
      router.push(`/dashboard/${newDashboard.id}`);
    } catch (error) {
      console.error('Failed to create dashboard:', error);
      alert('Failed to create dashboard. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="ml-4">
                <button
                onClick={() => router.push('/')}
                className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  GENA
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              
              <div className="ml-4">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-5 px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 mt-20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a dashboard title and optional description
          </p>
        </div>

        <form onSubmit={handleCreateDashboard} className="space-y-8">
          {/* Dashboard Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dashboard Title
            </label>
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mint dark:focus:ring-pink focus:border-transparent"
              placeholder="Enter dashboard title..."
              required
            />
          </div>

         {/* Dashboard Description */}
         <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
             Dashboard Description (optional)
           </label>
           <textarea
             value={dashboardDescription}
             onChange={(e) => setDashboardDescription(e.target.value)}
             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mint dark:focus:ring-pink focus:border-transparent"
             placeholder="Describe your dashboard (optional)"
             rows={3}
           />
         </div>

         {/* Created Date */}
         <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
             Created Date
           </label>
           <input
             type="text"
             value={createdDate}
             readOnly
             className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
           />
         </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!dashboardName.trim() || isCreating}
              className="px-6 py-3 bg-mint dark:bg-pink text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 