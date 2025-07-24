'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Dashboard {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function DashboardListPage() {
  const router = useRouter();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboards() {
      try {
        const res = await fetch('/api/dashboards');
        if (res.ok) {
          const data = await res.json();
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

  const handleCreateDashboard = () => {
    router.push('/dashboard/create');
  };

  const handleDeleteDashboard = async (dashboardId: string) => {
    setDeleteLoading(dashboardId);
    
    try {
      const response = await fetch(`/api/dashboards/${dashboardId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setDashboards(prev => prev.filter(d => d.id !== dashboardId));
      } else {
        alert('Failed to delete dashboard. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
      alert('Failed to delete dashboard. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint dark:border-pink mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboards</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your analytics dashboards</p>
          </div>
          <button
            onClick={handleCreateDashboard}
            className="bg-mint dark:bg-pink text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Create Dashboard
          </button>
        </div>

        {/* Dashboard List */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Dashboards
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-mint dark:bg-pink rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <button
                      onClick={() => handleDeleteDashboard(dashboard.id)}
                      disabled={deleteLoading === dashboard.id}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      title="Delete dashboard"
                    >
                      {deleteLoading === dashboard.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <Link href={`/dashboard/${dashboard.id}`} className="block group">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-mint dark:group-hover:text-pink transition-colors">
                      {dashboard.name}
                    </h3>
                    {dashboard.createdAt && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Created {new Date(dashboard.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="flex items-center text-gray-400 group-hover:text-mint dark:group-hover:text-pink transition-colors">
                      <span className="text-sm">View Dashboard</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-mint dark:hover:text-pink transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 