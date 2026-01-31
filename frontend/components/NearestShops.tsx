'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Package } from 'lucide-react';
import styles from './NearestShops.module.css';

interface Shop {
  id: string;
  name: string;
  location: string;
  distance: number;
  phone: string;
  timings: string;
  rating: number;
  productsCount: number;
  specialties: string[];
  icon: string;
}

const NearestShops = () => {
  const [shops, setShops] = useState<Shop[]>([
    {
      id: '1',
      name: 'राज कृषि भंडार',
      location: 'मुख्य बाज़ार, जन्नत पुर',
      distance: 2.3,
      phone: '+91-9876543210',
      timings: '6 AM - 8 PM',
      rating: 4.5,
      productsCount: 150,
      specialties: ['बीज', 'खाद', 'कीटनाशक'],
      icon: '🌾'
    },
    {
      id: '2',
      name: 'कृष्ण एग्रो स्टोर',
      location: 'पंचायत रोड, गाँव सेंटर',
      distance: 4.1,
      phone: '+91-9876543211',
      timings: '7 AM - 9 PM',
      rating: 4.2,
      productsCount: 200,
      specialties: ['खाद', 'उर्वरक', 'सेंचाई उपकरण'],
      icon: '🚜'
    },
    {
      id: '3',
      name: 'शर्मा किसान बाज़ार',
      location: 'रेलवे स्टेशन के पास',
      distance: 5.5,
      phone: '+91-9876543212',
      timings: '8 AM - 7 PM',
      rating: 4.8,
      productsCount: 250,
      specialties: ['बीज', 'खाद', 'उपकरण', 'कीटनाशक'],
      icon: '🌱'
    }
  ]);

  return (
    <section className={styles.nearestShops}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>आपके पास कृषि दुकानें</h2>
          <p className={styles.subtitle}>
            नज़दीकी दुकानों से बीज, खाद, और उपकरण खरीदें
          </p>
        </div>

        <div className={styles.grid}>
          {shops.map((shop) => (
            <div key={shop.id} className={styles.shopCard}>
              <div className={styles.shopHeader}>
                <span className={styles.shopIcon}>{shop.icon}</span>
                <div className={styles.shopInfo}>
                  <h3 className={styles.shopName}>{shop.name}</h3>
                  <div className={styles.rating}>
                    {'⭐'.repeat(Math.floor(shop.rating))} {shop.rating}
                  </div>
                </div>
              </div>

              <div className={styles.shopDetails}>
                <div className={styles.detail}>
                  <MapPin size={18} />
                  <div>
                    <p className={styles.detailLabel}>स्थान</p>
                    <p className={styles.detailValue}>{shop.location}</p>
                    <p className={styles.distance}>{shop.distance} km दूर</p>
                  </div>
                </div>

                <div className={styles.detail}>
                  <Phone size={18} />
                  <div>
                    <p className={styles.detailLabel}>फ़ोन</p>
                    <a href={`tel:${shop.phone}`} className={styles.phone}>
                      {shop.phone}
                    </a>
                  </div>
                </div>

                <div className={styles.detail}>
                  <Clock size={18} />
                  <div>
                    <p className={styles.detailLabel}>खुलने का समय</p>
                    <p className={styles.detailValue}>{shop.timings}</p>
                  </div>
                </div>

                <div className={styles.detail}>
                  <Package size={18} />
                  <div>
                    <p className={styles.detailLabel}>उपलब्ध सामान</p>
                    <p className={styles.detailValue}>{shop.productsCount}+ चीज़ें</p>
                  </div>
                </div>
              </div>

              <div className={styles.specialties}>
                {shop.specialties.map((specialty, idx) => (
                  <span key={idx} className={styles.tag}>
                    {specialty}
                  </span>
                ))}
              </div>

              <Link href={`/shop/${shop.id}`} className={styles.viewShop}>
                दुकान देखें 🏪
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearestShops;
