"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '../../lib/auth';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    role: 'farmer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.location,
        formData.role
      );

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Join Kisan Unnati</h1>
          <p className={styles.subtitle}>Create your account to access AI-powered farming tools</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your full name"
                required
              />
            </div>

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
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Create a password"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="location" className={styles.label}>Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={styles.input}
                placeholder="Your city/district"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="role" className={styles.label}>I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="farmer">Farmer</option>
              <option value="agricultural-expert">Agricultural Expert</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link href="/login" className={styles.link}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.imageSection}>
        <div className={styles.overlay}>
          <h2 className={styles.imageTitle}>किसान उन्नति</h2>
          <p className={styles.imageText}>
            Join thousands of farmers using AI to maximize their yields
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Farmers</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Acres Managed</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;