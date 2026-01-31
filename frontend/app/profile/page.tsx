"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, Lock, Trash2 } from 'lucide-react';
import { getProfile, updateProfile } from '../../lib/api';
import styles from './profile.module.css';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: {
    address: string;
    district: string;
    state: string;
    pincode: string;
  };
  farmDetails?: {
    size: string;
    soilType: string;
    irrigationType: string;
    mainCrops: string[];
  };
  createdAt?: string;
  avatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'location' | 'farm' | 'security'>('personal');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    role: 'farmer',
    location: {
      address: '',
      district: '',
      state: '',
      pincode: ''
    },
    farmDetails: {
      size: '',
      soilType: '',
      irrigationType: '',
      mainCrops: []
    },
    avatar: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain'];
  const IRRIGATION_TYPES = ['Drip', 'Sprinkler', 'Flood', 'Rain-fed', 'Mixed'];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await getProfile();
      if (result.success) {
        setProfile({
          name: result.data.name || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
          role: result.data.role || 'farmer',
          location: {
            address: result.data.location?.address || '',
            district: result.data.location?.district || '',
            state: result.data.location?.state || '',
            pincode: result.data.location?.pincode || ''
          },
          farmDetails: {
            size: result.data.farmDetails?.size || '',
            soilType: result.data.farmDetails?.soilType || '',
            irrigationType: result.data.farmDetails?.irrigationType || '',
            mainCrops: result.data.farmDetails?.mainCrops || []
          },
          createdAt: result.data.createdAt,
          avatar: result.data.avatar || ''
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const result = await updateProfile(profile);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    loadProfile();
    setError('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addCrop = (crop: string) => {
    if (crop && !profile.farmDetails?.mainCrops.includes(crop)) {
      setProfile({
        ...profile,
        farmDetails: {
          ...profile.farmDetails!,
          mainCrops: [...(profile.farmDetails?.mainCrops || []), crop]
        }
      });
    }
  };

  const removeCrop = (index: number) => {
    setProfile({
      ...profile,
      farmDetails: {
        ...profile.farmDetails!,
        mainCrops: profile.farmDetails!.mainCrops.filter((_, i) => i !== index)
      }
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Profile Settings</h1>
          <p className={styles.subtitle}>Manage your account information and preferences</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className={styles.editBtn}>
            <Edit2 size={20} />
            Edit Profile
          </button>
        ) : (
          <div className={styles.actionButtons}>
            <button onClick={handleCancel} className={styles.cancelBtn}>
              <X size={20} />
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.alert} data-type="error">
          {error}
        </div>
      )}

      {success && (
        <div className={styles.alert} data-type="success">
          {success}
        </div>
      )}

      <div className={styles.content}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <User size={48} />
                </div>
              )}
              {editing && (
                <label className={styles.avatarUpload}>
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.hiddenFileInput}
                    aria-label="Upload profile picture"
                  />
                </label>
              )}
            </div>
            <div className={styles.profileInfo}>
              <h2>{profile.name}</h2>
              <p className={styles.role}>{profile.role === 'farmer' ? '👨‍🌾 Farmer' : '🏪 Shopkeeper'}</p>
              {profile.createdAt && (
                <p className={styles.joinDate}>
                  <Calendar size={16} />
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'personal' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <User size={18} />
            Personal Info
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'location' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('location')}
          >
            <MapPin size={18} />
            Location
          </button>
          {profile.role === 'farmer' && (
            <button
              className={`${styles.tab} ${activeTab === 'farm' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('farm')}
            >
              🌾
              Farm Details
            </button>
          )}
          <button
            className={`${styles.tab} ${activeTab === 'security' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={18} />
            Security
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Personal Information</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <User size={16} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={styles.input}
                    disabled={!editing}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    className={styles.input}
                    disabled
                    title="Email cannot be changed"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Phone size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className={styles.input}
                    disabled={!editing}
                    placeholder="10 digit number"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Location Details</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Address</label>
                  <input
                    type="text"
                    value={profile.location.address}
                    onChange={(e) => setProfile({
                      ...profile,
                      location: { ...profile.location, address: e.target.value }
                    })}
                    className={styles.input}
                    disabled={!editing}
                    placeholder="Street address, village name, etc."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>State *</label>
                  <select
                    value={profile.location.state}
                    onChange={(e) => setProfile({
                      ...profile,
                      location: { ...profile.location, state: e.target.value }
                    })}
                    className={styles.select}
                    disabled={!editing}
                    title="Select your state"
                  >
                    <option value="">-- Select State --</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>District *</label>
                  <input
                    type="text"
                    value={profile.location.district}
                    onChange={(e) => setProfile({
                      ...profile,
                      location: { ...profile.location, district: e.target.value }
                    })}
                    className={styles.input}
                    disabled={!editing}
                    placeholder="Your district"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>PIN Code</label>
                  <input
                    type="text"
                    value={profile.location.pincode}
                    onChange={(e) => setProfile({
                      ...profile,
                      location: { ...profile.location, pincode: e.target.value }
                    })}
                    className={styles.input}
                    disabled={!editing}
                    placeholder="6 digit PIN"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Farm Details Tab */}
          {activeTab === 'farm' && profile.role === 'farmer' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Farm Information</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Farm Size (in acres)</label>
                  <input
                    type="text"
                    value={profile.farmDetails?.size || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      farmDetails: { ...profile.farmDetails!, size: e.target.value }
                    })}
                    className={styles.input}
                    disabled={!editing}
                    placeholder="e.g. 5 acres"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Soil Type</label>
                  <select
                    value={profile.farmDetails?.soilType || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      farmDetails: { ...profile.farmDetails!, soilType: e.target.value }
                    })}
                    className={styles.select}
                    disabled={!editing}
                    title="Select soil type for your farm"
                  >
                    <option value="">-- Select Soil Type --</option>
                    {SOIL_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Irrigation Type</label>
                  <select
                    value={profile.farmDetails?.irrigationType || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      farmDetails: { ...profile.farmDetails!, irrigationType: e.target.value }
                    })}
                    className={styles.select}
                    disabled={!editing}
                    title="Select irrigation type for your farm"
                  >
                    <option value="">-- Select Irrigation Type --</option>
                    {IRRIGATION_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Main Crops</label>
                  <div className={styles.cropsContainer}>
                    {profile.farmDetails?.mainCrops.map((crop, index) => (
                      <div key={index} className={styles.cropTag}>
                        {crop}
                        {editing && (
                          <button
                            onClick={() => removeCrop(index)}
                            className={styles.removeCrop}
                            type="button"
                            title="Remove crop"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    {editing && (
                      <input
                        type="text"
                        placeholder="Add crop and press Enter"
                        className={styles.cropInput}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCrop((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Security Settings</h3>
              <div className={styles.securitySection}>
                <div className={styles.securityCard}>
                  <Lock size={24} />
                  <div>
                    <h4>Change Password</h4>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <button className={styles.securityBtn}>Change Password</button>
                </div>

                <div className={styles.securityCard}>
                  <Mail size={24} />
                  <div>
                    <h4>Email Verification</h4>
                    <p>Your email is verified</p>
                  </div>
                  <span className={styles.verified}>✓ Verified</span>
                </div>

                <div className={styles.securityCard} data-danger="true">
                  <Trash2 size={24} />
                  <div>
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button className={styles.dangerBtn}>Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
