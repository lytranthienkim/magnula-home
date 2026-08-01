'use client';

import { Suspense } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartSkeleton } from './ChartSkeleton';

export function TopProductsChart({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Suspense fallback={<ChartSkeleton />}>
      <div className="bg-white border border-gray-200 p-3 sm:p-6 rounded-lg">
        <h2 className="text-sm font-bold text-black mb-4 sm:mb-6 uppercase">Top Products</h2>
        <div className="w-full h-64 sm:h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={35}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#000000" />
                <Cell fill="#1f2937" />
                <Cell fill="#374151" />
                <Cell fill="#6b7280" />
                <Cell fill="#9ca3af" />
                <Cell fill="#d1d5db" />
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                formatter={(value) => `${value} orders`}
                labelStyle={{ color: '#000' }}
              />
              <Legend
                verticalAlign="bottom"
                height={28}
                formatter={(value) => <span style={{ color: '#6b7280', fontSize: '10px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Suspense>
  );
}
