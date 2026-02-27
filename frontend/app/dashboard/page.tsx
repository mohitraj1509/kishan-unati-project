"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProfile, updateProfile } from '../../lib/api';
import Header from '../../components/Header';
import PricePredictionModal from '../../components/PricePredictionModal';
import styles from './Dashboard.module.css';

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface User {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  location?: {
    address?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
  farmDetails?: {
    size?: number | string;
    soilType?: string;
    irrigationType?: string;
    crops?: string[];
  };
  preferences?: {
    language?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }

    // Mock notifications
    setNotifications([
      { id: 1, type: 'info', message: 'New government scheme available for wheat farmers', time: '2 hours ago' },
      { id: 2, type: 'success', message: 'Your crop recommendation report is ready', time: '1 day ago' },
      { id: 3, type: 'warning', message: 'Heavy rainfall expected in your area', time: '2 days ago' }
    ]);

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const stats = [
    { title: 'Total Crops', value: '12', icon: '🌾', color: '#22c55e', change: '+2 this month' },
    { title: 'Yield This Season', value: '2.5T', icon: '📊', color: '#3b82f6', change: '+15% vs last year' },
    { title: 'Revenue', value: '₹1.2L', icon: '💰', color: '#f59e0b', change: '+8% this month' },
    { title: 'Active Schemes', value: '3', icon: '📋', color: '#ef4444', change: '2 new available' }
  ];

  const recentActivities = [
    { action: 'Uploaded wheat disease image', time: '2 hours ago', status: 'processing' },
    { action: 'Generated crop recommendation', time: '1 day ago', status: 'completed' },
    { action: 'Updated farm profile', time: '3 days ago', status: 'completed' },
    { action: 'Listed produce in marketplace', time: '1 week ago', status: 'sold' }
  ];

  const quickActions = [
    { title: 'Crop Recommendation', icon: '🤖', color: '#22c55e', action: () => router.push('/dashboard/crop-recommendation') },
    { title: 'Disease Detection', icon: '🔍', color: '#ef4444', action: () => router.push('/dashboard/disease-detection') },
    { title: 'Price Prediction', icon: '📈', color: '#f59e0b', action: () => setShowPriceModal(true) },
    { title: 'Weather Insights', icon: '🌤️', color: '#3b82f6', action: () => router.push('/dashboard/weather') },
    { title: 'Marketplace', icon: '💰', color: '#22c55e', action: () => router.push('/dashboard/marketplace') },
    { title: 'Government Schemes', icon: '📋', color: '#8b5cf6', action: () => router.push('/dashboard/schemes') },
    { title: 'Farm Analytics', icon: '📊', color: '#06b6d4', action: () => router.push('/dashboard/analytics') },
    { title: 'Voice Assistant', icon: '🎤', color: '#ec4899', action: () => router.push('/dashboard/voice-assistant') },
    { title: 'Community', icon: '👥', color: '#84cc16', action: () => router.push('/dashboard/community') }
  ];

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your farming dashboard...</p>
      </div>
    );
  }

  const ProfileSection = ({ user }: { user: User | null }) => {
    const [profileData, setProfileData] = useState({
      name: user?.name || '',
      phone: user?.phone || '',
      location: {
        address: user?.location?.address || '',
        district: user?.location?.district || '',
        state: user?.location?.state || '',
        pincode: user?.location?.pincode || ''
      },
      farmDetails: {
        size: user?.farmDetails?.size || '',
        soilType: user?.farmDetails?.soilType || '',
        irrigationType: user?.farmDetails?.irrigationType || '',
        crops: user?.farmDetails?.crops || []
      },
      preferences: {
        language: user?.preferences?.language || 'en',
        notifications: {
          email: user?.preferences?.notifications?.email ?? true,
          sms: user?.preferences?.notifications?.sms ?? true,
          push: user?.preferences?.notifications?.push ?? true
        }
      }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
      const loadProfile = async () => {
        try {
          const result = await getProfile();
          if (result.success) {
            const profile = result.data;
            setProfileData({
              name: profile.name || '',
              phone: profile.phone || '',
              location: {
                address: profile.location?.address || '',
                district: profile.location?.district || '',
                state: profile.location?.state || '',
                pincode: profile.location?.pincode || ''
              },
              farmDetails: {
                size: profile.farmDetails?.size || '',
                soilType: profile.farmDetails?.soilType || '',
                irrigationType: profile.farmDetails?.irrigationType || '',
                crops: profile.farmDetails?.crops || []
              },
              preferences: {
                language: profile.preferences?.language || 'en',
                notifications: {
                  email: profile.preferences?.notifications?.email ?? true,
                  sms: profile.preferences?.notifications?.sms ?? true,
                  push: profile.preferences?.notifications?.push ?? true
                }
              }
            });
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
        } finally {
          setLoadingProfile(false);
        }
      };

      loadProfile();
    }, []);

    const handleInputChange = (field: string, value: any) => {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] || {}) as object),
          [field]: value
        }
      }));
    };

    const handleSave = async () => {
      setSaving(true);
      setMessage('');

      try {
        const result = await updateProfile(profileData);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        // Update local storage
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Failed to update profile');
      } finally {
        setSaving(false);
      }
    };

    if (loadingProfile) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your profile...</p>
        </div>
      );
    }

    return (
      <div className={styles.profileSection}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>My Profile</h1>
              <p className={styles.subtitle}>Manage your personal and farming information</p>
            </div>
            <div className={styles.headerRight}>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className={styles.editButton}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className={styles.editActions}>
                  <button
                    onClick={() => setIsEditing(false)}
                    className={styles.cancelButton}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {message && (
          <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <div className={styles.profileGrid}>
          {/* Personal Information */}
          <section className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <h3>👤 Personal Information</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={styles.input}
                  />
                ) : (
                  <p className={styles.value}>{profileData.name || 'Not provided'}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <p className={styles.value}>{user?.email}</p>
                <small className={styles.hint}>Email cannot be changed</small>
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={styles.input}
                    placeholder="+91 XXXXX XXXXX"
                  />
                ) : (
                  <p className={styles.value}>{profileData.phone || 'Not provided'}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <p className={styles.value}>{user?.role}</p>
              </div>
            </div>
          </section>

          {/* Location Information */}
          <section className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <h3>📍 Location Details</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.formGroup}>
                <label>Address</label>
                {isEditing ? (
                  <textarea
                    value={profileData.location.address}
                    onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                    className={styles.textarea}
                    placeholder="Enter your full address"
                  />
                ) : (
                  <p className={styles.value}>{profileData.location.address || 'Not provided'}</p>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>District</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location.district}
                      onChange={(e) => handleNestedChange('location', 'district', e.target.value)}
                      className={styles.input}
                      placeholder="Enter your district"
                      title="District"
                    />
                  ) : (
                    <p className={styles.value}>{profileData.location.district || 'Not provided'}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location.state}
                      onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p className={styles.value}>{profileData.location.state || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Pincode</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location.pincode}
                    onChange={(e) => handleNestedChange('location', 'pincode', e.target.value)}
                    className={styles.input}
                    placeholder="6-digit pincode"
                  />
                ) : (
                  <p className={styles.value}>{profileData.location.pincode || 'Not provided'}</p>
                )}
              </div>
            </div>
          </section>

          {/* Farm Details */}
          <section className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <h3>🌾 Farm Details</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Farm Size (acres)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={profileData.farmDetails.size}
                      onChange={(e) => handleNestedChange('farmDetails', 'size', parseFloat(e.target.value) || '')}
                      className={styles.input}
                      min="0"
                      step="0.1"
                    />
                  ) : (
                    <p className={styles.value}>{profileData.farmDetails.size ? `${profileData.farmDetails.size} acres` : 'Not provided'}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Soil Type</label>
                  {isEditing ? (
                    <select
                      value={profileData.farmDetails.soilType}
                      onChange={(e) => handleNestedChange('farmDetails', 'soilType', e.target.value)}
                      className={styles.select}
                    >
                      <option value="">Select soil type</option>
                      <option value="clay">Clay</option>
                      <option value="sandy">Sandy</option>
                      <option value="loamy">Loamy</option>
                      <option value="silt">Silt</option>
                      <option value="peaty">Peaty</option>
                    </select>
                  ) : (
                    <p className={styles.value}>{profileData.farmDetails.soilType || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Irrigation Type</label>
                {isEditing ? (
                  <select
                    value={profileData.farmDetails.irrigationType}
                    onChange={(e) => handleNestedChange('farmDetails', 'irrigationType', e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Select irrigation type</option>
                    <option value="rainfed">Rainfed</option>
                    <option value="canal">Canal</option>
                    <option value="borewell">Borewell</option>
                    <option value="tube_well">Tube Well</option>
                    <option value="tank">Tank</option>
                  </select>
                ) : (
                  <p className={styles.value}>{profileData.farmDetails.irrigationType || 'Not provided'}</p>
                )}
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <h3>⚙️ Preferences</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.formGroup}>
                <label>Language</label>
                {isEditing ? (
                  <select
                    value={profileData.preferences.language}
                    onChange={(e) => handleNestedChange('preferences', 'language', e.target.value)}
                    className={styles.select}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="te">தెలుగు</option>
                    <option value="ta">தமிழ்</option>
                  </select>
                ) : (
                  <p className={styles.value}>
                    {profileData.preferences.language === 'en' && 'English'}
                    {profileData.preferences.language === 'hi' && 'हिंदी'}
                    {profileData.preferences.language === 'te' && 'தెలుగు'}
                    {profileData.preferences.language === 'ta' && 'தமிழ்'}
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Notification Preferences</label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkbox}>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={profileData.preferences.notifications.email}
                        onChange={(e) => handleNestedChange('preferences', 'notifications', {
                          ...profileData.preferences.notifications,
                          email: e.target.checked
                        })}
                      />
                    ) : (
                      <span className={profileData.preferences.notifications.email ? styles.checked : styles.unchecked}>
                        {profileData.preferences.notifications.email ? '✓' : '✗'}
                      </span>
                    )}
                    Email Notifications
                  </label>

                  <label className={styles.checkbox}>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={profileData.preferences.notifications.sms}
                        onChange={(e) => handleNestedChange('preferences', 'notifications', {
                          ...profileData.preferences.notifications,
                          sms: e.target.checked
                        })}
                      />
                    ) : (
                      <span className={profileData.preferences.notifications.sms ? styles.checked : styles.unchecked}>
                        {profileData.preferences.notifications.sms ? '✓' : '✗'}
                      </span>
                    )}
                    SMS Notifications
                  </label>

                  <label className={styles.checkbox}>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={profileData.preferences.notifications.push}
                        onChange={(e) => handleNestedChange('preferences', 'notifications', {
                          ...profileData.preferences.notifications,
                          push: e.target.checked
                        })}
                      />
                    ) : (
                      <span className={profileData.preferences.notifications.push ? styles.checked : styles.unchecked}>
                        {profileData.preferences.notifications.push ? '✓' : '✗'}
                      </span>
                    )}
                    Push Notifications
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🌾</span>
            <span className={styles.logoText}>Kisan Unnati</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className={styles.navIcon}>📊</span>
            Overview
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'crops' ? styles.active : ''}`}
            onClick={() => setActiveTab('crops')}
          >
            <span className={styles.navIcon}>🌾</span>
            My Crops
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'marketplace' ? styles.active : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            <span className={styles.navIcon}>💰</span>
            Marketplace
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className={styles.navIcon}>📈</span>
            Analytics
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className={styles.navIcon}>👤</span>
            Profile
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span className={styles.logoutIcon}>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {activeTab === 'overview' && (
          <>
            {/* Header */}
            <header className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                  <h1 className={styles.title}>
                    Welcome back, {user?.name}! 👋
                  </h1>
                  <p className={styles.subtitle}>
                    Here's what's happening with your farm today
                  </p>
                </div>
                <div className={styles.headerRight}>
                  <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.userDetails}>
                      <span className={styles.userName}>{user?.name}</span>
                      <span className={styles.userRole}>{user?.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Stats Cards */}
            <section className={styles.statsSection}>
              <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <div key={index} className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: stat.color + '20' }}>
                      <span style={{ color: stat.color }}>{stat.icon}</span>
                    </div>
                    <div className={styles.statContent}>
                      <h3 className={styles.statValue}>{stat.value}</h3>
                      <p className={styles.statTitle}>{stat.title}</p>
                      <span className={styles.statChange} style={{ color: stat.color }}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Main Dashboard Grid */}
            <div className={styles.dashboardGrid}>
              {/* Weather Widget */}
              <section className={styles.weatherWidget}>
                <div className={styles.widgetHeader}>
                  <h3>Weather Insights</h3>
                  <span className={styles.widgetIcon}>🌤️</span>
                </div>
                <div className={styles.weatherContent}>
                  <div className={styles.weatherPlaceholder}>
                    <div className={styles.weatherPlaceholderIcon}>🌤️</div>
                    <h4 className={styles.weatherPlaceholderTitle}>Weather Insights</h4>
                    <p className={styles.weatherPlaceholderText}>Get detailed weather forecasts and agricultural insights for better farming decisions</p>
                    <Link href="/dashboard/weather">
                      <button className={styles.weatherPlaceholderButton}>
                        View Weather Details
                      </button>
                    </Link>
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section className={styles.quickActionsWidget}>
                <div className={styles.widgetHeader}>
                  <h3>Quick Actions</h3>
                  <span className={styles.widgetIcon}>⚡</span>
                </div>
                <div className={styles.actionsGrid}>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className={styles.actionButton}
                      onClick={action.action}
                      style={{ '--action-color': action.color } as React.CSSProperties}
                    >
                      <span className={styles.actionIcon}>{action.icon}</span>
                      <span className={styles.actionTitle}>{action.title}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Recent Activities */}
              <section className={styles.activitiesWidget}>
                <div className={styles.widgetHeader}>
                  <h3>Recent Activities</h3>
                  <span className={styles.widgetIcon}>📋</span>
                </div>
                <div className={styles.activitiesList}>
                  {recentActivities.map((activity, index) => (
                    <div key={index} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        {activity.status === 'processing' && '⏳'}
                        {activity.status === 'completed' && '✅'}
                        {activity.status === 'sold' && '💰'}
                      </div>
                      <div className={styles.activityContent}>
                        <p className={styles.activityText}>{activity.action}</p>
                        <span className={styles.activityTime}>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Notifications */}
              <section className={styles.notificationsWidget}>
                <div className={styles.widgetHeader}>
                  <h3>Notifications</h3>
                  <span className={styles.widgetIcon}>🔔</span>
                </div>
                <div className={styles.notificationsList}>
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`${styles.notificationItem} ${styles[notification.type]}`}>
                      <div className={styles.notificationIcon}>
                        {notification.type === 'info' && 'ℹ️'}
                        {notification.type === 'success' && '✅'}
                        {notification.type === 'warning' && '⚠️'}
                      </div>
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationText}>{notification.message}</p>
                        <span className={styles.notificationTime}>{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* AI Insights */}
              <section className={styles.aiInsightsWidget}>
                <div className={styles.widgetHeader}>
                  <h3>AI Insights</h3>
                  <span className={styles.widgetIcon}>🤖</span>
                </div>
                <div className={styles.insightsContent}>
                  <div className={styles.insightCard}>
                    <div className={styles.insightIcon}>🌾</div>
                    <div className={styles.insightContent}>
                      <h4>Optimal Planting Time</h4>
                      <p>Based on weather patterns, plant wheat within the next 2 weeks for best yield.</p>
                    </div>
                  </div>
                  <div className={styles.insightCard}>
                    <div className={styles.insightIcon}>💧</div>
                    <div className={styles.insightContent}>
                      <h4>Irrigation Alert</h4>
                      <p>Soil moisture is low. Consider irrigation in the next 24 hours.</p>
                    </div>
                  </div>
                  <div className={styles.insightCard}>
                    <div className={styles.insightIcon}>📈</div>
                    <div className={styles.insightContent}>
                      <h4>Market Trend</h4>
                      <p>Wheat prices are expected to rise by 8% in the next month.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Farm Health */}
              <section className={styles.farmHealthWidget}>
                <div className={styles.widgetHeader}>
                  <h3>Farm Health</h3>
                  <span className={styles.widgetIcon}>🌱</span>
                </div>
                <div className={styles.healthMetrics}>
                  <div className={styles.healthMetric}>
                    <div className={styles.metricLabel}>Soil Health</div>
                    <div className={styles.metricBar}>
                      <div className={styles.metricFill} style={{ width: '85%', backgroundColor: '#22c55e' }}></div>
                    </div>
                    <span className={styles.metricValue}>85%</span>
                  </div>
                  <div className={styles.healthMetric}>
                    <div className={styles.metricLabel}>Crop Health</div>
                    <div className={styles.metricBar}>
                      <div className={styles.metricFill} style={{ width: '92%', backgroundColor: '#22c55e' }}></div>
                    </div>
                    <span className={styles.metricValue}>92%</span>
                  </div>
                  <div className={styles.healthMetric}>
                    <div className={styles.metricLabel}>Pest Risk</div>
                    <div className={styles.metricBar}>
                      <div className={styles.metricFill} style={{ width: '25%', backgroundColor: '#f59e0b' }}></div>
                    </div>
                    <span className={styles.metricValue}>25%</span>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        {activeTab === 'profile' && <ProfileSection user={user} />}
      </main>
      </div>

      {/* Price Prediction Modal */}
      <PricePredictionModal 
        isOpen={showPriceModal} 
        onClose={() => setShowPriceModal(false)}
        userDistrict={user?.location?.district}
      />
    </>
  );
};

export default Dashboard;