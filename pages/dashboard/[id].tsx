// pages/dashboard/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Chart from '../../components/Chart';

interface ChartType {
  id: string;
  type: 'number' | 'bar' | 'line';
  title: string;
  dataEndpoint: string;
}

const DashboardDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [charts, setCharts] = useState<ChartType[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/dashboards/${id}`)
      .then(res => res.json())
      .then(data => {
        setCharts(data.charts || []);
      });
  }, [id]);

  const handleAddChart = async () => {
    const res = await fetch('/api/charts', {
      method: 'POST',
      body: JSON.stringify({
        dashboardId: id,
        type: 'bar', // or 'number', 'line'
        title: 'Sample Chart',
        dataEndpoint: '/api/data/total_revenue'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const newChart = await res.json();
    setCharts(prev => [...prev, newChart]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard {id}</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
        onClick={handleAddChart}
      >
        Add Chart
      </button>

      <div className="grid grid-cols-1 gap-4">
        {charts.map(chart => (
          <Chart
            key={chart.id}
            type={chart.type}
            title={chart.title}
            dataEndpoint={chart.dataEndpoint}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardDetail;
