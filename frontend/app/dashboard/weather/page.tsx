"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Weather.module.css';
import { WeatherService, WeatherData } from '../../../lib/weatherService';

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('Delhi, IN');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await WeatherService.getWeatherData(location);
        setWeatherData(data);
      } catch (err) {
        console.error('Failed to fetch weather data:', err);
        setError('Failed to load weather data. Please check your API key and try again.');
        // Fallback to mock data if API fails
        setWeatherData({
          current: {
            temperature: 28,
            condition: 'Partly Cloudy',
            humidity: 65,
            windSpeed: 12,
            pressure: 1013,
            uvIndex: 7,
            visibility: 10,
            icon: '⛅'
          },
          forecast: [
            { day: 'Today', date: 'Jan 19', temp: 28, minTemp: 22, condition: 'Partly Cloudy', icon: '⛅', rainChance: 20 },
            { day: 'Tomorrow', date: 'Jan 20', temp: 30, minTemp: 24, condition: 'Sunny', icon: '☀️', rainChance: 10 },
            { day: 'Wednesday', date: 'Jan 21', temp: 27, minTemp: 21, condition: 'Light Rain', icon: '🌦️', rainChance: 70 },
            { day: 'Thursday', date: 'Jan 22', temp: 29, minTemp: 23, condition: 'Sunny', icon: '☀️', rainChance: 5 },
            { day: 'Friday', date: 'Jan 23', temp: 26, minTemp: 20, condition: 'Cloudy', icon: '☁️', rainChance: 30 }
          ],
          alerts: [
            {
              type: 'warning',
              title: 'Heavy Rainfall Expected',
              message: 'Heavy rainfall expected in your area tomorrow. Take necessary precautions for your crops.',
              time: '2 hours ago'
            }
          ],
          agricultural: {
            irrigation: 'Recommended - Soil moisture is low',
            planting: 'Good conditions for wheat planting',
            harvesting: 'Rice harvesting can begin next week',
            risk: 'Low risk of pest attacks'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <h2>Loading Weather Data...</h2>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/dashboard" className={styles.backButton}>
            ← Back to Dashboard
          </Link>
          <h1 className={styles.title}>Weather Insights</h1>
          <p className={styles.subtitle}>Weather data unavailable</p>
          <div className={styles.error}>
            <p>{error}</p>
            <p><strong>Setup Instructions:</strong></p>
            <ol>
              <li>Get a free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a></li>
              <li>Add your API key to <code>.env.local</code> as <code>NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>Weather Insights</h1>
        <p className={styles.subtitle}>
          Real-time weather data and agricultural recommendations
        </p>

        <div className={styles.locationSelector}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name (e.g., Delhi, Mumbai, Bangalore)"
            className={styles.locationInput}
            onKeyPress={(e) => e.key === 'Enter' && setLoading(true)}
          />
          <button
            onClick={() => setLoading(true)}
            className={styles.locationButton}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update Location'}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <p>⚠️ {error}</p>
          </div>
        )}
      </div>

      <div className={styles.content}>
        {weatherData && (
          <>
            {/* Current Weather */}
            <section className={styles.currentWeather}>
          <div className={styles.weatherCard}>
            <div className={styles.location}>
              <h2>{location}</h2>
              <span className={styles.date}>January 19, 2026</span>
            </div>

            <div className={styles.mainWeather}>
              <div className={styles.temperature}>
                <span className={styles.tempValue}>{weatherData.current.temperature}°</span>
                <span className={styles.tempUnit}>C</span>
              </div>
              <div className={styles.condition}>
                <span className={styles.weatherIcon}>{weatherData.current.icon}</span>
                <span className={styles.conditionText}>{weatherData.current.condition}</span>
              </div>
            </div>

            <div className={styles.weatherDetails}>
              <div className={styles.detail}>
                <span className={styles.detailIcon}>💧</span>
                <div>
                  <span className={styles.detailValue}>{weatherData.current.humidity}%</span>
                  <span className={styles.detailLabel}>Humidity</span>
                </div>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailIcon}>💨</span>
                <div>
                  <span className={styles.detailValue}>{weatherData.current.windSpeed} km/h</span>
                  <span className={styles.detailLabel}>Wind Speed</span>
                </div>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailIcon}>📊</span>
                <div>
                  <span className={styles.detailValue}>{weatherData.current.pressure} hPa</span>
                  <span className={styles.detailLabel}>Pressure</span>
                </div>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailIcon}>☀️</span>
                <div>
                  <span className={styles.detailValue}>{weatherData.current.uvIndex}</span>
                  <span className={styles.detailLabel}>UV Index</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weather Alerts */}
        {weatherData.alerts.length > 0 && (
          <section className={styles.alertsSection}>
            <h2>⚠️ Weather Alerts</h2>
            <div className={styles.alertsList}>
              {weatherData.alerts.map((alert, index) => (
                <div key={index} className={`${styles.alert} ${styles[alert.type]}`}>
                  <div className={styles.alertIcon}>
                    {alert.type === 'warning' && '⚠️'}
                    {alert.type === 'danger' && '🚨'}
                    {alert.type === 'info' && 'ℹ️'}
                  </div>
                  <div className={styles.alertContent}>
                    <h3>{alert.title}</h3>
                    <p>{alert.message}</p>
                    <span className={styles.alertTime}>{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5-Day Forecast */}
        <section className={styles.forecastSection}>
          <h2>📅 5-Day Forecast</h2>
          <div className={styles.forecastGrid}>
            {weatherData.forecast.map((day, index) => (
              <div key={index} className={styles.forecastCard}>
                <div className={styles.forecastHeader}>
                  <span className={styles.dayName}>{day.day}</span>
                  <span className={styles.date}>{day.date}</span>
                </div>
                <div className={styles.forecastIcon}>{day.icon}</div>
                <div className={styles.forecastTemp}>
                  <span className={styles.maxTemp}>{day.temp}°</span>
                  <span className={styles.minTemp}>{day.minTemp}°</span>
                </div>
                <div className={styles.forecastCondition}>{day.condition}</div>
                <div className={styles.rainChance}>
                  <span className={styles.rainIcon}>🌧️</span>
                  <span>{day.rainChance}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Agricultural Insights */}
        <section className={styles.agriculturalSection}>
          <h2>🌾 Agricultural Insights</h2>
          <div className={styles.insightsGrid}>
            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>💧</div>
              <div className={styles.insightContent}>
                <h3>Irrigation</h3>
                <p>{weatherData.agricultural.irrigation}</p>
              </div>
            </div>

            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>🌱</div>
              <div className={styles.insightContent}>
                <h3>Planting</h3>
                <p>{weatherData.agricultural.planting}</p>
              </div>
            </div>

            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>🚜</div>
              <div className={styles.insightContent}>
                <h3>Harvesting</h3>
                <p>{weatherData.agricultural.harvesting}</p>
              </div>
            </div>

            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>🛡️</div>
              <div className={styles.insightContent}>
                <h3>Pest Risk</h3>
                <p>{weatherData.agricultural.risk}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hourly Forecast */}
        <section className={styles.hourlySection}>
          <h2>🕐 Today's Hourly Forecast</h2>
          <div className={styles.hourlyScroll}>
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i;
              const temp = 25 + Math.sin((hour - 6) * Math.PI / 12) * 5;
              const isNow = hour === 14; // Current hour

              return (
                <div key={hour} className={`${styles.hourlyItem} ${isNow ? styles.currentHour : ''}`}>
                  <span className={styles.hourLabel}>
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </span>
                  <span className={styles.hourIcon}>
                    {hour >= 6 && hour <= 18 ? '☀️' : '🌙'}
                  </span>
                  <span className={styles.hourTemp}>{Math.round(temp)}°</span>
                  {isNow && <span className={styles.nowIndicator}>Now</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Weather Map Placeholder */}
        <section className={styles.mapSection}>
          <h2>🗺️ Weather Map</h2>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapIcon}>🗺️</div>
            <h3>Interactive Weather Map</h3>
            <p>Detailed radar and satellite imagery coming soon</p>
            <button className={styles.mapButton}>
              View Full Map
            </button>
          </div>
        </section>
        </>
        )}
      </div>
    </div>
  );
};

export default Weather;