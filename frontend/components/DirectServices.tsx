'use client'

import React from 'react';
import { Mic, AlertCircle, Cloud, Leaf, Droplet, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './DirectServices.module.css';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  href?: string;
  onClick?: () => void;
}

export default function DirectServices() {
  const services: Service[] = [
    {
      id: 'voice',
      title: 'वॉइस सहायक',
      description: 'आवाज़ में अपना सवाल पूछें',
      icon: <Mic size={32} />,
      color: '#2563eb',
      bgColor: '#eff6ff',
      href: '/voice-assistant'
    },
    {
      id: 'crop',
      title: 'फसल सुझाव',
      description: 'अपनी जमीन के लिए सही फसल चुनें',
      icon: <Leaf size={32} />,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      href: '/crop-recommendation'
    },
    {
      id: 'disease',
      title: 'रोग पहचान',
      description: 'फसल की बीमारी की जांच करें',
      icon: <AlertCircle size={32} />,
      color: '#dc2626',
      bgColor: '#fef2f2',
      href: '/disease-detection'
    },
    {
      id: 'weather',
      title: 'मौसम जानकारी',
      description: 'आज का मौसम और भविष्य की जानकारी',
      icon: <Cloud size={32} />,
      color: '#9333ea',
      bgColor: '#faf5ff',
      href: '#'
    },
    {
      id: 'water',
      title: 'सिंचाई सलाह',
      description: 'सही समय पर सिंचाई करने के सुझाव',
      icon: <Droplet size={32} />,
      color: '#0891b2',
      bgColor: '#ecf0ff',
      href: '#'
    },
    {
      id: 'shop',
      title: 'दुकान खोजें',
      description: 'पास की कृषि दुकान ढूंढें',
      icon: <ShoppingBag size={32} />,
      color: '#ea580c',
      bgColor: '#fff7ed',
      href: '#'
    }
  ];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🚀 सीधे सेवाएँ</h2>
        <p className={styles.subtitle}>
          लॉगिन के बिना एक क्लिक में सभी सेवाएं इस्तेमाल करें
        </p>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service) => (
          <Link
            key={service.id}
            href={service.href || '#'}
            className={styles.serviceCard}
            style={{
              '--card-bg': service.bgColor,
              '--card-color': service.color
            } as React.CSSProperties}
          >
            <div className={styles.iconWrapper}>
              <span style={{ color: service.color }}>
                {service.icon}
              </span>
            </div>
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceDesc}>{service.description}</p>
            <div className={styles.arrow}>
              <ArrowRight size={20} />
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.bottomText}>
        <p>किसान लॉगिन करके अधिक सुविधाएं पा सकते हैं</p>
      </div>
    </section>
  );
}
