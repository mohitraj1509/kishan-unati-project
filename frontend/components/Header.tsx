'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '../lib/auth';
import styles from './Header.module.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      console.log('Auth check:', isAuth); // Debug
      setIsLoggedIn(isAuth);
    };
    
    // Check dark mode preference
    const checkDarkMode = () => {
      const savedMode = localStorage.getItem('darkMode');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedMode ? savedMode === 'true' : prefersDark;
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark-mode', isDark);
    };
    
    // Initial check
    checkAuth();
    checkDarkMode();
    
    // Listen for storage changes (login/logout from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        console.log('Storage changed:', e.key); // Debug
        checkAuth();
      }
      if (e.key === 'darkMode') {
        checkDarkMode();
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

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark-mode', newMode);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <header className={`${styles.header} ${isLoggedIn ? styles.loggedIn : styles.notLoggedIn}`}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.mobileOverlay} 
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
      
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" onClick={closeMobileMenu}>
            <span className={styles.logoText}>किसान उन्नति</span>
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink} onClick={closeMobileMenu}>होम</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className={styles.navItem}>
                  <Link href="/dashboard" className={styles.navLink} onClick={closeMobileMenu}>📊 मेरा खेत</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/dashboard" className={styles.navLink} onClick={closeMobileMenu}>📦 स्टॉक</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/marketplace" className={styles.navLink} onClick={closeMobileMenu}>🛒 मंडी</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/profile" className={styles.navLink} onClick={closeMobileMenu}>👤 प्रोफाइल</Link>
                </li>
              </>
            ) : (
              <>
                <li className={styles.navItem}>
                  <Link href="/marketplace" className={styles.navLink} onClick={closeMobileMenu}>🛒 मंडी</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/schemes" className={styles.navLink} onClick={closeMobileMenu}>📋 योजना</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className={styles.darkModeToggle}>
          <button 
            onClick={toggleDarkMode} 
            className={styles.darkModeBtn}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>

        <div className={`${styles.authButtons} ${isMobileMenuOpen ? styles.authButtonsOpen : ''}`}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <Link href="/dashboard" className={styles.dashboardBtn} onClick={closeMobileMenu}>
                📊 डैशबोर्ड
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                लॉग आउट
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn} onClick={closeMobileMenu}>
                लॉग इन
              </Link>
              <Link href="/register" className={styles.registerBtn} onClick={closeMobileMenu}>
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