'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalFarmers: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeSchemes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data:', data);
        
        // Handle the response structure from backend
        if (data.success && data.data) {
          const statsData = data.data;
          setStats({
            totalFarmers: statsData.users?.farmers || 0,
            totalBuyers: statsData.users?.buyers || 0,
            totalProducts: statsData.products?.total || 0,
            totalOrders: statsData.orders?.total || 0,
            totalRevenue: statsData.revenue?.total || 0,
            activeSchemes: 0,
          });
        } else {
          // Fallback to zero stats
          setStats({
            totalFarmers: 0,
            totalBuyers: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
            activeSchemes: 0,
          });
        }
      } else {
        console.error('Dashboard fetch failed:', response.status);
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel - Kisan Unnati</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeTab === 'overview' ? 'bg-green-600 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  📊 Overview
                </button>
              </li>
              <li>
                <Link href="/dashboard/users" className="block px-4 py-2 rounded hover:bg-gray-100">
                  👥 Users Management
                </Link>
              </li>
              <li>
                <Link href="/dashboard/farmers" className="block px-4 py-2 rounded hover:bg-gray-100">
                  🌾 Farmers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/buyers" className="block px-4 py-2 rounded hover:bg-gray-100">
                  🛒 Buyers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/marketplace" className="block px-4 py-2 rounded hover:bg-gray-100">
                  🏪 Marketplace Control
                </Link>
              </li>
              <li>
                <Link href="/dashboard/schemes" className="block px-4 py-2 rounded hover:bg-gray-100">
                  📜 Schemes Management
                </Link>
              </li>
              <li>
                <Link href="/dashboard/content" className="block px-4 py-2 rounded hover:bg-gray-100">
                  📝 Content Moderation
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="block px-4 py-2 rounded hover:bg-gray-100">
                  📈 Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/revenue" className="block px-4 py-2 rounded hover:bg-gray-100">
                  💰 Revenue
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="block px-4 py-2 rounded hover:bg-gray-100">
                  ⚙️ Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Farmers</p>
                    <p className="text-3xl font-bold text-green-600">{stats?.totalFarmers || 0}</p>
                  </div>
                  <div className="text-4xl">🌾</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Buyers</p>
                    <p className="text-3xl font-bold text-blue-600">{stats?.totalBuyers || 0}</p>
                  </div>
                  <div className="text-4xl">🛒</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Products</p>
                    <p className="text-3xl font-bold text-purple-600">{stats?.totalProducts || 0}</p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-orange-600">{stats?.totalOrders || 0}</p>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">₹{stats?.totalRevenue || 0}</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Schemes</p>
                    <p className="text-3xl font-bold text-indigo-600">{stats?.activeSchemes || 0}</p>
                  </div>
                  <div className="text-4xl">📜</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="font-medium">New farmer registered</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">New</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="font-medium">New product listed</p>
                      <p className="text-sm text-gray-600">5 hours ago</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Product</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="font-medium">Payment received</p>
                      <p className="text-sm text-gray-600">1 day ago</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Payment</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
