'use client'

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Store, ArrowRight } from 'lucide-react';
import styles from './success.module.css';

export default function ShopkeeperSuccess() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <CheckCircle className={styles.successIcon} size={80} />
        </div>
        
        <h1 className={styles.title}>🎉 Congratulations!</h1>
        <h2 className={styles.subtitle}>Your shop has been successfully registered</h2>
        
        <div className={styles.message}>
          <p>Your agricultural shop is now live on our platform.</p>
          <p>Now you can manage your stock and reach farmers.</p>
        </div>

        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>✅</span>
            <span>Millions of farmers can see your shop</span>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>✅</span>
            <span>Easily update your products</span>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>✅</span>
            <span>Receive direct orders</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/shopkeeper/dashboard" className={styles.primaryButton}>
            <Store size={20} />
            Open Your Dashboard
            <ArrowRight size={20} />
          </Link>
          
          <Link href="/" className={styles.secondaryButton}>
            Go to Home Page
          </Link>
        </div>

        <div className={styles.helpText}>
          <p>मदद चाहिए? <a href="tel:18001234567">1800-123-4567</a> पर कॉल करें</p>
        </div>
      </div>
    </div>
  );
}
