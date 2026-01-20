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
    const checkAuth = () => setIsLoggedIn(isAuthenticated());
    
    checkAuth();
    
    // Listen for storage changes (login/logout from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };
    
    // Listen for custom auth change events (login/logout in same tab)
    const handleAuthChange = () => checkAuth();
    
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
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <span className={styles.logoText}>किसान उन्नति</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/marketplace" className={styles.navLink}>Marketplace</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/schemes" className={styles.navLink}>Schemes</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={styles.navLink}>About</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.authButtons}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <Link href="/dashboard" className={styles.dashboardBtn}>
                My Dashboard
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn}>
                Login
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;