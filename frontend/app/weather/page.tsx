'use client'

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import styles from './weather.module.css';

export default function Weather() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!location.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWeatherData({
        location: location,
        temperature: 28,
        condition: 'साफ़ मौसम',
        humidity: 65,
        windSpeed: 12,
        forecast: [
          { day: 'आज', temp: 28, condition: '☀️' },
          { day: 'कल', temp: 26, condition: '⛅' },
          { day: 'परसों', temp: 25, condition: '🌧️' },
          { day: '4 दिन', temp: 27, condition: '☀️' },
          { day: '5 दिन', temp: 29, condition: '☀️' }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        <h1 className={styles.title}>🌤️ मौसम की जानकारी</h1>
        <p className={styles.subtitle}>अपने क्षेत्र का मौसम जानें</p>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="अपना शहर/गांव का नाम डालें"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className={styles.searchBtn}>
            खोजें
          </button>
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>मौसम की जानकारी लोड हो रही है...</p>
          </div>
        )}

        {weatherData && !loading && (
          <div className={styles.weatherCard}>
            <div className={styles.currentWeather}>
              <h2 className={styles.locationName}>{weatherData.location}</h2>
              <div className={styles.mainTemp}>{weatherData.temperature}°C</div>
              <p className={styles.condition}>{weatherData.condition}</p>
              
              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>नमी</span>
                  <span className={styles.detailValue}>{weatherData.humidity}%</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>हवा की गति</span>
                  <span className={styles.detailValue}>{weatherData.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            <div className={styles.forecast}>
              <h3 className={styles.forecastTitle}>आगामी मौसम</h3>
              <div className={styles.forecastGrid}>
                {weatherData.forecast.map((day: any, index: number) => (
                  <div key={index} className={styles.forecastDay}>
                    <div className={styles.dayName}>{day.day}</div>
                    <div className={styles.dayIcon}>{day.condition}</div>
                    <div className={styles.dayTemp}>{day.temp}°C</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.tips}>
              <h3 className={styles.tipsTitle}>खेती के लिए सुझाव</h3>
              <ul className={styles.tipsList}>
                <li>अगले 3 दिनों में बारिश की संभावना है, सिंचाई की जरूरत नहीं</li>
                <li>तापमान फसल के लिए उपयुक्त है</li>
                <li>नमी का स्तर सामान्य है</li>
              </ul>
            </div>
          </div>
        )}

        {!weatherData && !loading && (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>🌍</div>
            <p>अपने क्षेत्र का नाम डालकर मौसम की जानकारी प्राप्त करें</p>
          </div>
        )}
      </div>
    </div>
  );
}
