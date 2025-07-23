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
  const [selectedLayout, setSelectedLayout] = useState<string>('');
  const [dashboardName, setDashboardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLayout || !dashboardName.trim()) {
      alert('Please select a layout and enter a dashboard name');
      return;
    }

    setIsCreating(true);

    try {
      // Get the selected layout template
      const layoutTemplate = layoutTemplates.find(t => t.id === selectedLayout);
      if (!layoutTemplate) {
        throw new Error('Selected layout not found');
      }

      // Create new dashboard via API
      const response = await fetch('/api/dashboards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: dashboardName.trim(),
          layout: layoutTemplate.layout,
          charts: [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create dashboard');
      }

      const newDashboard = await response.json();

      // Redirect to the new dashboard
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Analytics</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="bg-mint dark:bg-pink text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Back to Home
              </button>
              <div className="ml-4">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a layout template and give your dashboard a name
          </p>
        </div>

        <form onSubmit={handleCreateDashboard} className="space-y-8">
          {/* Dashboard Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dashboard Name
            </label>
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mint dark:focus:ring-pink focus:border-transparent"
              placeholder="Enter dashboard name..."
              required
            />
          </div>

          {/* Layout Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Choose Layout Template
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {layoutTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedLayout === template.id
                      ? 'border-mint dark:border-pink bg-mint/10 dark:bg-pink/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedLayout(template.id)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{template.preview}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                  </div>
                  {selectedLayout === template.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-mint dark:bg-pink rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
              disabled={!selectedLayout || !dashboardName.trim() || isCreating}
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