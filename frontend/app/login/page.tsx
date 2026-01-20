"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/auth';
import styles from './Login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
      const result = await login(formData.email, formData.password);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your Kisan Unnati account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Don't have an account?{' '}
            <Link href="/register" className={styles.link}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.imageSection}>
        <div className={styles.overlay}>
          <h2 className={styles.imageTitle}>किसान उन्नति</h2>
          <p className={styles.imageText}>
            Empowering farmers with AI-driven agricultural solutions
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🤖</span>
              <span>AI-Powered Insights</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🌾</span>
              <span>Crop Recommendations</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📊</span>
              <span>Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;