"use client";

import React from 'react';
import Link from 'next/link';
import { Users, Store } from 'lucide-react';
import Header from '../../components/Header';
import styles from './roleselection.module.css';

export default function RoleSelection() {
  return (
    <>
      <Header />
      <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>🌾 Welcome to Kisan Unnati</h1>
          <p className={styles.subtitle}>Who are you? Choose your role</p>
        </div>

        <div className={styles.rolesGrid}>
          {/* Farmer Role */}
          <Link href="/register/farmer" className={styles.roleCard}>
            <div className={styles.roleIcon}>
              <Users size={48} />
            </div>
            <h2 className={styles.roleTitle}>👨‍🌾 Farmer</h2>
            <p className={styles.roleDescription}>
              I am a farmer. I need crop advice, market prices, and other agricultural services.
            </p>
            <div className={styles.features}>
              <span>✅ Crop Advice</span>
              <span>✅ Disease Detection</span>
              <span>✅ Market Prices</span>
              <span>✅ Government Schemes</span>
            </div>
          </Link>

          {/* Shopkeeper Role */}
          <Link href="/register/shopkeeper" className={styles.roleCard}>
            <div className={styles.roleIcon} style={{ color: '#f59e0b' }}>
              <Store size={48} />
            </div>
            <h2 className={styles.roleTitle}>🏪 Shopkeeper</h2>
            <p className={styles.roleDescription}>
              I am an agricultural shopkeeper. I want to share my stock.
            </p>
            <div className={styles.features}>
              <span>✅ Stock Management</span>
              <span>✅ Reach Farmers</span>
              <span>✅ Order Tracking</span>
              <span>✅ Sales Analysis</span>
            </div>
          </Link>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>Already have an account?</p>
          <Link href="/login" className={styles.loginLink}>
            Log In
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}