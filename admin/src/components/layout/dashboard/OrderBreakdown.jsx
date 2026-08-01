'use client';

export default function OrderBreakdown({ stats }) {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h2 className="text-sm font-bold text-black mb-6 uppercase">Order Breakdown</h2>
      <div className="space-y-4">
        {Object.entries(stats.orderStatus).map(([status, count]) => {
          const total = stats.totalOrders;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={status}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 font-medium">{status}</span>
                <span className="text-sm font-bold text-black">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
