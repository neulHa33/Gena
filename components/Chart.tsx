// components/Chart.tsx
import { useEffect, useState } from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface NumberChartData {
  value: number;
}

interface XYChartDatum {
  label: string;
  value: number;
}

type ChartProps =
  | {
      type: 'number';
      title: string;
      dataEndpoint: string;
    }
  | {
      type: 'bar' | 'line';
      title: string;
      dataEndpoint: string;
    };

const Chart = ({ type, title, dataEndpoint }: ChartProps) => {
  const [data, setData] = useState<NumberChartData | XYChartDatum[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(dataEndpoint);
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, [dataEndpoint]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-bold mb-2">{title}</h2>

      {type === 'number' && 'value' in data && (
        <p className="text-3xl">{data.value}</p>
      )}

      {type === 'bar' && Array.isArray(data) && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {type === 'line' && Array.isArray(data) && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;
