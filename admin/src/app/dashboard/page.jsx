'use client';

import { useEffect, useState } from 'react';
import { getAllProducts } from '@/api/products';
import { getAllOrders } from '@/api/orders';
import {
  DashboardHeader,
  MetricsGrid,
  OrderBreakdown,
  TopProductsChart,
  RevenueChart,
} from '@/components/layout/dashboard';

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
          getAllProducts(100, 0),
          getAllOrders(100, 0),
        ]);

        const products = productsRes.data || [];
        const orders = ordersRes.data || [];

        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (parseFloat(order.totalPrice) || 0);
        }, 0);

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

        const stockAvailable = products.filter(p => p.status === 'in stock').length;

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

        const revenueData = generateRevenueData(orders);

        setStats({
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders: orders.length,
          customerGrowth: Math.floor(Math.random() * 20) + 5,
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
      <DashboardHeader />
      <MetricsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderBreakdown stats={stats} />
        <TopProductsChart data={chartData.topProductsData} />
      </div>

      <RevenueChart data={chartData.revenueData} />
    </div>
  );
}
