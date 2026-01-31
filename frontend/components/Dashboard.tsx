'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, Droplet, Cloud, TrendingUp, AlertCircle, ShoppingBag, Settings, Bell } from 'lucide-react';
import styles from './Dashboard.module.css';

interface UserDashboard {
  name: string;
  district: string;
  farmSize: string;
  crops: string[];
}

interface Crop {
  id: string;
  name: string;
  area: number;
  plantedDate: string;
  expectedHarvest: string;
  health: 'good' | 'warning' | 'critical';
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserDashboard | null>(null);
  const [notifications, setNotifications] = useState(3);
  const [myCrops, setMyCrops] = useState<Crop[]>([
    { id: '1', name: 'गेहूँ', area: 2.5, plantedDate: '15 अक्टूबर', expectedHarvest: '30 मार्च', health: 'good' },
    { id: '2', name: 'सोयाबीन', area: 1.5, plantedDate: '25 जून', expectedHarvest: '15 सितंबर', health: 'warning' },
    { id: '3', name: 'मूंग', area: 1, plantedDate: '10 जुलाई', expectedHarvest: '20 अगस्त', health: 'good' }
  ]);

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    const userStr = localStorage.getItem('user');
    
    if (userDataStr) {
      try {
        setUserData(JSON.parse(userDataStr));
      } catch (e) {
        console.error('Error parsing userData:', e);
      }
    } else if (userStr) {
      // Fallback to user object
      try {
        const user = JSON.parse(userStr);
        setUserData({
          name: user.name || user.fullName || 'किसान भाई',
          district: user.district || 'अज्ञात',
          farmSize: user.farmSize || '0',
          crops: []
        });
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  return (
    <section className={styles.dashboard}>
      {/* Header with Notifications */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div>
            <h2 className={styles.greeting}>
              नमस्ते, {userData?.name || 'किसान भाई'}! 👋
            </h2>
            <p className={styles.subGreeting}>
              आपके खेत के लिए आज की जरूरी जानकारी यहाँ है
            </p>
          </div>
          <button className={styles.notificationBtn}>
            <Bell size={24} />
            {notifications > 0 && <span className={styles.badge}>{notifications}</span>}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dcfce7' }}>
            <Leaf size={28} color="#16a34a" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>आपकी फसलें</p>
            <h3 className={styles.statValue}>{userData?.crops?.length || 0}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e0f2fe' }}>
            <Droplet size={28} color="#0284c7" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>खेत का आकार</p>
            <h3 className={styles.statValue}>{userData?.farmSize || '0'} एकड़</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fef3c7' }}>
            <Cloud size={28} color="#ca8a04" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>मंडी भाव</p>
            <h3 className={styles.statValue}>₹ 2,450</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fce7f3' }}>
            <TrendingUp size={28} color="#ec4899" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>उपज की क्षमता</p>
            <h3 className={styles.statValue}>↑ 15%</h3>
          </div>
        </div>
      </div>

      {/* Important Alerts */}
      <div className={styles.alertsSection}>
        <h3 className={styles.sectionTitle}>⚠️ महत्वपूर्ण सूचनाएँ</h3>
        <div className={styles.alertsList}>
          <div className={styles.alertItem} style={{ borderLeft: '4px solid #ef4444' }}>
            <AlertCircle size={20} color="#ef4444" />
            <div>
              <p className={styles.alertTitle}>बीज खरीदी का समय</p>
              <p className={styles.alertDescription}>अगली फसल के लिए बीज अभी खरीद लें</p>
            </div>
          </div>

          <div className={styles.alertItem} style={{ borderLeft: '4px solid #f97316' }}>
            <AlertCircle size={20} color="#f97316" />
            <div>
              <p className={styles.alertTitle}>सिंचाई की सलाह</p>
              <p className={styles.alertDescription}>अगले 3 दिन में बारिश की संभावना है</p>
            </div>
          </div>

          <div className={styles.alertItem} style={{ borderLeft: '4px solid #06b6d4' }}>
            <AlertCircle size={20} color="#06b6d4" />
            <div>
              <p className={styles.alertTitle}>सरकारी योजना</p>
              <p className={styles.alertDescription}>किसान क्रेडिट कार्ड के लिए आवेदन करें</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className={styles.servicesSection}>
        <h3 className={styles.sectionTitle}>👨‍🌾 आपकी सेवाएँ</h3>
        <div className={styles.servicesGrid}>
          <Link href="/dashboard" className={styles.serviceCard}>
            <div className={styles.serviceIcon} style={{ background: '#dcfce7' }}>
              <Leaf size={32} color="#16a34a" />
            </div>
            <h4>फसल प्रबंधन</h4>
            <p>अपनी फसलें जोड़ें और ट्रैक करें</p>
          </Link>

          <Link href="/marketplace" className={styles.serviceCard}>
            <div className={styles.serviceIcon} style={{ background: '#fed7aa' }}>
              <ShoppingBag size={32} color="#ea580c" />
            </div>
            <h4>मंडी देखें</h4>
            <p>फसल के सर्वश्रेष्ठ भाव जानें</p>
          </Link>

          <Link href="/voice-assistant" className={styles.serviceCard}>
            <div className={styles.serviceIcon} style={{ background: '#e0e7ff' }}>
              <span style={{ fontSize: '1.8rem' }}>🎤</span>
            </div>
            <h4>बोलकर पूछें</h4>
            <p>किसी भी सवाल का जवाब लें</p>
          </Link>

          <Link href="/schemes" className={styles.serviceCard}>
            <div className={styles.serviceIcon} style={{ background: '#dbeafe' }}>
              <span style={{ fontSize: '1.8rem' }}>📋</span>
            </div>
            <h4>सरकारी योजनाएँ</h4>
            <p>सभी सहायता योजनाएँ देखें</p>
          </Link>
        </div>
      </div>

      {/* My Crops */}
      <div className={styles.cropsSection}>
        <h3 className={styles.sectionTitle}>🌾 मेरी फसलें</h3>
        <div className={styles.cropsList}>
          {myCrops.map(crop => (
            <div key={crop.id} className={styles.cropCard}>
              <div className={styles.cropHeader}>
                <h4 className={styles.cropName}>{crop.name}</h4>
                <span className={`${styles.healthBadge} ${styles[`health-${crop.health}`]}`}>
                  {crop.health === 'good' ? '✓ अच्छी' : crop.health === 'warning' ? '⚠ सावधानी' : '⛔ गंभीर'}
                </span>
              </div>
              <div className={styles.cropDetails}>
                <div className={styles.cropDetail}>
                  <span className={styles.detailLabel}>क्षेत्र</span>
                  <span className={styles.detailValue}>{crop.area} एकड़</span>
                </div>
                <div className={styles.cropDetail}>
                  <span className={styles.detailLabel}>बोई तारीख</span>
                  <span className={styles.detailValue}>{crop.plantedDate}</span>
                </div>
                <div className={styles.cropDetail}>
                  <span className={styles.detailLabel}>कटाई</span>
                  <span className={styles.detailValue}>{crop.expectedHarvest}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Tasks */}
      <div className={styles.tasksSection}>
        <h3 className={styles.sectionTitle}>📝 आज के काम</h3>
        <div className={styles.tasksList}>
          <div className={styles.taskItem}>
            <input type="checkbox" className={styles.taskCheckbox} aria-label="फसल को पानी देना" />
            <p>फसल को पानी देना</p>
            <span className={styles.timeTag}>सुबह 6 बजे</span>
          </div>

          <div className={styles.taskItem}>
            <input type="checkbox" className={styles.taskCheckbox} aria-label="खाद डालना (क्षेत्र B)" />
            <p>खाद डालना (क्षेत्र B)</p>
            <span className={styles.timeTag}>दोपहर 2 बजे</span>
          </div>

          <div className={styles.taskItem}>
            <input type="checkbox" className={styles.taskCheckbox} aria-label="मंडी भाव चेक करना" />
            <p>मंडी भाव चेक करना</p>
            <span className={styles.timeTag}>शाम 5 बजे</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinksSection}>
        <Link href="/profile" className={styles.quickLink}>
          <Settings size={20} />
          प्रोफाइल सेटिंग्स
        </Link>
      </div>
    </section>
  );
};

export default Dashboard;
