'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Store, Phone, MapPin, User, Lock, CheckCircle2, MapPinned } from 'lucide-react';
import Header from '../../../components/Header';
import styles from './shopkeeper.module.css';

export default function ShopkeeperRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    location: '',
    state: '',
    district: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;

    setFormData({
      ...formData,
      [name]: nextValue
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.shopName || !formData.ownerName || !formData.phone || !formData.location) {
      setError('Please fill all required information');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10 digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Backend API call
      const response = await fetch('http://localhost:3001/api/auth/register-shopkeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/register/shopkeeper/success');
      } else {
        const data = await response.json();
        setError(data.message || 'Registration error occurred');
      }
    } catch (err) {
      setError('Connection problem');
    } finally {
      setIsLoading(false);
    }
  };

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
        <div className={styles.header}>
          <div className={styles.icon}>🏪</div>
          <h1 className={styles.title}>Register Your Shop</h1>
          <p className={styles.subtitle}>Connect with thousands of farmers and grow your business</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Store size={20} />
              Shop Name
            </label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="e.g., Raj Krishi Kendra"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <User size={20} />
              Owner Name
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Phone size={20} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 digit mobile number"
              className={styles.input}
              maxLength={10}
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <MapPinned size={20} />
                State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={styles.select}
                required
                aria-label="Select State"
              >
                <option value="">-- Select State --</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Your district"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <MapPin size={20} />
              Shop Address
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Complete shop address with landmarks"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Lock size={20} />
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password (min 6 chars)"
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <CheckCircle2 size={20} />
              Confirm Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.togglePassword}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Registering your shop...
              </>
            ) : (
              'Register Shop'
            )}
          </button>

          <div className={styles.divider}>or</div>

          <Link href="/login" className={styles.secondaryButton}>
            Already have an account? Log In
          </Link>
        </form>

        <div className={styles.benefits}>
          <h3 className={styles.benefitsTitle}>🎯 Benefits of Joining</h3>
          <ul className={styles.benefitsList}>
            <li>✨ Reach thousands of farmers across India</li>
            <li>📢 Showcase your products & inventory</li>
            <li>📦 Receive direct orders from farmers</li>
            <li>📊 Track sales and business analytics</li>
            <li>🆓 100% free forever - No hidden charges</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}
