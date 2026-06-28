'use client';

import { useEffect, useState } from 'react';
import { getAllProducts } from '@/api/products';
import { getAllOrders } from '@/api/orders';
import { HiOutlineArrowTrendingUp } from 'react-icons/hi2';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    customerGrowth: 0,
    stockAvailable: 0,
    totalProducts: 0,
    orderStatus: {
      Completed: 0,
      Processing: 0,
      Pending: 0,
      Shipping: 0,
      Cancelled: 0,
    },
  });
  const [chartData, setChartData] = useState({
    revenueData: [],
    topProductsData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          getAllProducts(),
          getAllOrders(),
        ]);

        const products = productsRes.data || [];
        const orders = ordersRes.data || [];

        // Calculate total revenue
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (parseFloat(order.totalPrice) || 0);
        }, 0);

        // Calculate order status counts
        const orderStatus = {
          Completed: 0,
          Processing: 0,
          Pending: 0,
          Shipping: 0,
          Cancelled: 0,
        };

        orders.forEach(order => {
          const status = order.status || 'Pending';
          if (orderStatus[status] !== undefined) {
            orderStatus[status]++;
          }
        });

        // Calculate stock available
        const stockAvailable = products.filter(p => p.status === 'in stock').length;

        // Calculate top products
        const productOrderCounts = {};
        orders.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              const productId = item.productId;
              productOrderCounts[productId] = (productOrderCounts[productId] || 0) + item.quantity;
            });
          }
        });

        const topProductsData = products
          .map(p => ({
            name: p.productName.substring(0, 20),
            value: productOrderCounts[p.id] || 0,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);

        // Generate revenue trend data
        const revenueData = generateRevenueData(orders);

        setStats({
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders: orders.length,
          customerGrowth: Math.floor(Math.random() * 20) + 5, // Sample growth
          stockAvailable,
          totalProducts: products.length,
          orderStatus,
        });

        setChartData({
          revenueData,
          topProductsData,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateRevenueData = (orders) => {
    const days = 7;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' });

      const dayRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.toDateString() === date.toDateString();
        })
        .reduce((sum, order) => sum + (parseFloat(order.totalPrice) || 0), 0);

      data.push({
        date: dateStr,
        revenue: Math.round(dayRevenue * 100) / 100,
      });
    }

    return data;
  };

  const MetricCard = ({ label, value, suffix = '', growth = null, isPrice = false }) => (
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-40"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 border border-gray-200 p-6 h-32 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-black uppercase">Dashboard Report</h1>
        <p className="text-sm text-gray-600 mt-1">Commerce core tracking metrics</p>
      </div>

      {/* Top Metrics Grid - 3 Columns */}
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

      {/* Charts Grid - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Breakdown */}
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

        {/* Top Products - Pie Chart */}
        {chartData.topProductsData.length > 0 && (
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h2 className="text-sm font-bold text-black mb-6 uppercase">Top Products</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData.topProductsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={95}
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
                  height={36}
                  formatter={(value) => <span style={{ color: '#6b7280', fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Revenue Trend - Full Width */}
      {chartData.revenueData.length > 0 && (
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h2 className="text-sm font-bold text-black mb-6 uppercase">Revenue Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData.revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" stroke="#d1d5db" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis stroke="#d1d5db" tick={{ fontSize: 12, fill: '#9ca3af' }} />
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
      )}
    </div>
  );
}
