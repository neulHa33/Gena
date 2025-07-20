// pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Dashboard {
  id: string;
  name: string;
}

export default function Home() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const fetchDashboards = async () => {
    const res = await fetch('/api/dashboards');
    const data = await res.json();
    setDashboards(data);
  };

  // 최초 로딩 시 대시보드 리스트 불러오기
  useEffect(() => {
    fetchDashboards();
  }, []);

  // Creating new dashboard
  const handleCreateDashboard = async () => {
    const name = prompt('Please enter a new dashboard name:');
    if (!name || name.trim() === '') return;

    setLoading(true);

    try {
      const res = await fetch('/api/dashboards', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({name}),
      });

      const newDashboard = await res.json();

      setDashboards((prev) => [...prev, newDashboard]);

      router.push(`/dashboard/${newDashboard.id}`);
    } catch (error) {
      alert('An error occurred while creating the dashboard.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">📊 Dashboard List</h1>

      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        onClick={handleCreateDashboard}
        disabled={loading}
      >
        {loading ? 'Creating...' : '+ Create New Dashboard'}
      </button>

      {dashboards.length === 0 ? (
        <p className="text-gray-500">There are no dashboards created yet. Click the button above to create a new one.</p>
      ) : (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {dashboards.map((d) => (
            <li
              key={d.id}
              className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer"
              onClick={() => router.push(`/dashboard/${d.id}`)}
            >
              <p className="text-xl font-semibold">{d.name}</p>
              <p className="text-gray-500 text-sm">ID: {d.id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
