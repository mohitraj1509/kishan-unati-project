'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '../lib/auth';
import styles from './Header.module.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      console.log('Auth check:', isAuth); // Debug
      setIsLoggedIn(isAuth);
    };
    
    // Initial check
    checkAuth();
    
    // Listen for storage changes (login/logout from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        console.log('Storage changed:', e.key); // Debug
        checkAuth();
      }
    };
    
    // Listen for custom auth change events (login/logout in same tab)
    const handleAuthChange = () => {
      console.log('Auth change event triggered'); // Debug
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header className={`${styles.header} ${isLoggedIn ? styles.loggedIn : styles.notLoggedIn}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <span className={styles.logoText}>किसान उन्नति</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>होम</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className={styles.navItem}>
                  <Link href="/dashboard" className={styles.navLink}>📊 मेरा खेत</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/dashboard" className={styles.navLink}>📦 स्टॉक</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/marketplace" className={styles.navLink}>🛒 मंडी</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/profile" className={styles.navLink}>👤 प्रोफाइल</Link>
                </li>
              </>
            ) : (
              <>
                <li className={styles.navItem}>
                  <Link href="/marketplace" className={styles.navLink}>🛒 मंडी</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/schemes" className={styles.navLink}>📋 योजना</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className={styles.authButtons}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <Link href="/dashboard" className={styles.dashboardBtn}>
                📊 डैशबोर्ड
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                लॉग आउट
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn}>
                लॉग इन
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                खाता बनाएं
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;