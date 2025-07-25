'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DarkModeToggle from '../components/DarkModeToggle';
import Sidebar from '../components/Sidebar';

interface Dashboard {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Load dashboards from API
    async function fetchDashboards() {
      setLoading(true);
      try {
        const response = await fetch('/api/dashboards');
        if (response.ok) {
          const data = await response.json();
          setDashboards(data);
        }
      } catch (error) {
        console.error('Failed to load dashboards:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboards();
  }, []);

  const handleCreateDashboard = useCallback(() => {
    router.push('/dashboard/create');
  }, [router]);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const sortedDashboards = useMemo(() => {
    return dashboards
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 3);
  }, [dashboards]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint dark:border-pink mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleSidebarToggle}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mint dark:focus:ring-pink"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
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

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose} 
        />

        {/* Main Content */}
        <div className="flex-1 mt-5">
          <div className="px-4 py-8">
            {/* Header */}
            <div className="text-center mb-7 animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up">
                AI-Powered SQL Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 animate-slide-up animation-delay-200">
                Analyze data in seconds using natural language — no SQL needed.
              </p>
              <button
                onClick={handleCreateDashboard}
                className="bg-mint dark:bg-pink text-black px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 animate-slide-up animation-delay-400"
              >
                Create New Dashboard
              </button>
            </div>

            {/* Features Section */}
            <div className="max-w-5xl mx-auto animate-fade-in animation-delay-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 bg-mint/10 dark:bg-pink/10 rounded-lg group-hover:bg-mint/20 dark:group-hover:bg-pink/20 transition-colors">
                    <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Natural Language to SQL</h3>
                  <p className="text-gray-600 dark:text-gray-400">Just type your question — GENA turns it into insights.</p>
                </div>
                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 bg-mint/10 dark:bg-pink/10 group-hover:bg-mint/20 dark:group-hover:bg-pink/20 transition-colors">
                    <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Auto-Generated Charts</h3>
                  <p className="text-gray-600 dark:text-gray-400">GENA builds the right chart based on your intent.</p>
                </div>
                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 bg-mint/10 dark:bg-pink/10 group-hover:bg-mint/20 dark:group-hover:bg-pink/20 transition-colors">
                    <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Drag & Drop Dashboard</h3>
                  <p className="text-gray-600 dark:text-gray-400">Arrange and resize visualizations with ease.</p>
                </div>
              </div>
            </div>

            {/* Dashboard List */}
            <div className="mt-8 max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Recent Dashboards
                </h2>
                <span className="text-gray-500 dark:text-gray-400">
                  {dashboards.length} dashboard{dashboards.length !== 1 ? 's' : ''}
                </span>
              </div>

              {dashboards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No dashboards yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first dashboard to get started</p>
                  <button
                    onClick={handleCreateDashboard}
                    className="bg-mint dark:bg-pink text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create Your First Dashboard
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedDashboards.map((dashboard) => (
                    <Link
                      key={dashboard.id}
                      href={`/dashboard/${dashboard.id}`}
                      className="block group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-mint dark:bg-pink rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div className="text-gray-400 group-hover:text-mint dark:group-hover:text-pink transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-mint dark:group-hover:text-pink transition-colors">
                          {dashboard.name}
                        </h3>
                        {dashboard.createdAt && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Created {new Date(dashboard.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            
          </div>
        </div>
      </div>


    </div>
  );
}
