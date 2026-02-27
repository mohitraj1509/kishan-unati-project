"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import styles from './Login.module.css';

const Login = () => {
  const [role, setRole] = useState('farmer');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get role from URL params if available
  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole) {
      setRole(urlRole);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint = '';
      
      if (role === 'farmer') {
        endpoint = 'http://localhost:3001/api/auth/login';
      } else if (role === 'shopkeeper') {
        endpoint = 'http://localhost:3001/api/auth/login-shopkeeper';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: role === 'farmer' ? formData.email : undefined,
          phone: role === 'shopkeeper' ? formData.email : undefined,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && (data.success || data.token || data.data?.token)) {
        // Handle backend response format: { success: true, data: { user: {...}, token: "..." } }
        const backendData = data.data || data;
        const token = backendData.token || '';
        const user = backendData.user || {};
        
        if (!token) {
          setError('लॉगिन टोकन नहीं मिला। कृपया फिर से कोशिश करें।');
          setLoading(false);
          return;
        }

        // Store token and user info in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', role);
        localStorage.setItem('userData', JSON.stringify({
          name: user.name || user.fullName || 'किसान भाई',
          email: user.email || formData.email,
          district: user.location?.district || 'अज्ञात',
          farmSize: user.farmSize || '0'
        }));

        // Dispatch auth change event to update Header
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth-change'));
        }

        // Redirect to the correct dashboard
        if (role === 'shopkeeper') {
          router.push('/shopkeeper/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'लॉगिन विफल रहा');
        console.error('Login error:', data);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('कनेक्शन में समस्या है। कृपया बाद में फिर से कोशिश करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>🌾 किसान उन्नति</h1>
          <p className={styles.subtitle}>अपने खाते में लॉग इन करें</p>
        </div>

        {/* Role Selector */}
        <div className={styles.roleSelector}>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === 'farmer' ? styles.active : ''}`}
            onClick={() => setRole('farmer')}
          >
            👨‍🌾 किसान
          </button>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === 'shopkeeper' ? styles.active : ''}`}
            onClick={() => setRole('shopkeeper')}
          >
            🏪 दुकानदार
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              {role === 'farmer' ? 'ईमेल पता' : 'फ़ोन नंबर'}
            </label>
            <input
              type={role === 'farmer' ? 'email' : 'tel'}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder={role === 'farmer' ? 'अपनी ईमेल दर्ज करें' : '10 अंकों का नंबर'}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>पासवर्ड</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="अपना पासवर्ड दर्ज करें"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'लॉग इन हो रहे हैं...' : 'लॉग इन करें'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            खाता नहीं है?{' '}
            <Link href="/register" className={styles.link}>
              खाता बनाएं
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.imageSection}>
        <div className={styles.overlay}>
          <h2 className={styles.imageTitle}>🌾 किसान उन्नति</h2>
          <p className={styles.imageText}>
            आपकी खेती को बेहतर बनाने के लिए AI-संचालित समाधान
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;