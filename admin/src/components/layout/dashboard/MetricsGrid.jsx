'use client';

import { MetricCard } from './MetricCard';

export function MetricsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        label="Total Sales"
        value={stats.totalRevenue}
        suffix=""
        growth={15.8}
        isPrice={true}
      />
      <MetricCard
        label="Total Orders"
        value={stats.totalOrders}
        growth={8.3}
      />
      <MetricCard
        label="Customer Growth"
        value={stats.customerGrowth}
        suffix=""
        growth={12.5}
      />
    </div>
  );
}
