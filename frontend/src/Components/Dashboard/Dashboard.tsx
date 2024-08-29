import React from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, Legend, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page A', uv: 300, pv: 2400, amt: 2400 },
  { name: 'Page A', uv: 500, pv: 2400, amt: 2400 },
  { name: 'Page A', uv: 100, pv: 2400, amt: 2400 },
  { name: 'Page A', uv: 600, pv: 2400, amt: 2400 },
];


const Dashboard: React.FC = () => {
  const { dashboardId } = useParams();
  console.log(dashboardId);
  return (
    <div className="menu-data">
      <p>{dashboardId}</p>
      <ResponsiveContainer width={700} height="80%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip cursor={{ stroke: '#2BC790', strokeWidth: 1 }} />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
