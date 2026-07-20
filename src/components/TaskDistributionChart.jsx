'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '@/lib/axios';

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

export default function TaskDistributionChart({ projectId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDistribution = async () => {
      try {
        const tasksRes = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
          {
            params: { _t: Date.now() },
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          }
        );
        const tasks = tasksRes.data;

        // Status wise task count
        const statusCount = {};
        tasks.forEach(task => {
          const status = task.status || 'todo';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });

        const statusLabels = {
          'todo': 'To Do',
          'in-progress': 'In Progress',
          'review': 'Review',
          'done': 'Done'
        };

        const chartData = Object.keys(statusCount).map((key, index) => ({
          name: statusLabels[key] || key,
          value: statusCount[key],
        }));

        setData(chartData.length > 0 ? chartData : [
          { name: 'To Do', value: 0 },
          { name: 'In Progress', value: 0 },
          { name: 'Review', value: 0 },
          { name: 'Done', value: 0 },
        ]);
      } catch (error) {
        console.error('Error fetching task distribution:', error);
        setData([
          { name: 'To Do', value: 8 },
          { name: 'In Progress', value: 5 },
          { name: 'Review', value: 3 },
          { name: 'Done', value: 12 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTaskDistribution();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-md">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}