'use client';

import { Suspense } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartSkeleton } from './ChartSkeleton';

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Suspense fallback={<ChartSkeleton />}>
      <div className="bg-white border border-gray-200 p-3 sm:p-6 rounded-lg">
        <h2 className="text-sm font-bold text-black mb-4 sm:mb-6 uppercase">Revenue Trend (Last 7 Days)</h2>
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" stroke="#d1d5db" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis stroke="#d1d5db" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                formatter={(value) => `$${value.toLocaleString()}`}
                labelStyle={{ color: '#000' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#000"
                strokeWidth={3}
                dot={{ fill: '#000', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Suspense>
  );
}
