'use client';

import { HiOutlineArrowTrendingUp } from 'react-icons/hi2';

export function MetricCard({ label, value, suffix = '', growth = null, isPrice = false }) {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <p className="text-xs text-gray-600 font-semibold uppercase mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-black">
            {isPrice ? '$' : ''}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {growth !== null && (
            <div className="flex items-center gap-1 mt-2">
              <HiOutlineArrowTrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">{growth}% from last week</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
