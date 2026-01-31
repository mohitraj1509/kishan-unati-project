'use client'

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import styles from './Marketplace.module.css';
import { TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';

interface MarketData {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  arrival: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  change?: number;
  changePercent?: number;
  timestamp: string;
}

interface Filters {
  state: string;
  district: string;
  commodity: string;
  searchTerm: string;
}

const STATES = [
  'All States',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const COMMODITIES = [
  'All Commodities',
  'Wheat',
  'Rice',
  'Cotton',
  'Sugarcane',
  'Maize',
  'Mustard',
  'Soyabean',
  'Pulses',
  'Groundnut',
  'Onion',
  'Potato',
  'Tomato',
  'Chilly',
  'Turmeric',
  'Ginger',
];

const DISTRICTS: { [key: string]: string[] } = {
  'All States': [],
  'Andhra Pradesh': ['All Districts', 'Anantapur', 'Chittoor', 'Cudapah', 'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'Yasangi'],
  'Maharashtra': ['All Districts', 'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Navi Mumbai', 'Osmanabaad', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Washim', 'Yavatmal'],
  'Uttar Pradesh': ['All Districts', 'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Banke', 'Baraut', 'Bareilly', 'Basti', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandausi', 'Chandpur', 'Chanpur', 'Charkhari', 'Chauri Chaura', 'Chaukhandi', 'Chaupur', 'Chaurasia', 'Chhatarpur', 'Chhindwara', 'Chitrakoot', 'Chowk', 'Churk'],
  'Punjab': ['All Districts', 'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Mohali', 'Muktsar', 'Nawanshahr', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'Tarn Taran'],
  'Rajasthan': ['All Districts', 'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Ganganagar', 'Gangs', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jalor', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Phalodi', 'Pratapgarh', 'Ramsar', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sriganganagar', 'Sujangarh', 'Tonk', 'Udaipur'],
};

const generateMockData = (): MarketData[] => {
  const mockData: MarketData[] = [
    {
      id: '1',
      state: 'Maharashtra',
      district: 'Pune',
      market: 'Pune Agricultural Market',
      commodity: 'Onion',
      arrival: '1,250 quintals',
      minPrice: 1200,
      maxPrice: 1600,
      modalPrice: 1400,
      change: 45,
      changePercent: 3.3,
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      state: 'Punjab',
      district: 'Amritsar',
      market: 'Amritsar Grain Market',
      commodity: 'Wheat',
      arrival: '5,800 quintals',
      minPrice: 2400,
      maxPrice: 2600,
      modalPrice: 2500,
      change: -30,
      changePercent: -1.2,
      timestamp: new Date().toISOString(),
    },
    {
      id: '3',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      market: 'Lucknow Central Market',
      commodity: 'Potato',
      arrival: '3,200 quintals',
      minPrice: 800,
      maxPrice: 1200,
      modalPrice: 1000,
      change: 120,
      changePercent: 13.7,
      timestamp: new Date().toISOString(),
    },
    {
      id: '4',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      market: 'Guntur Cotton Market',
      commodity: 'Cotton',
      arrival: '450 quintals',
      minPrice: 5800,
      maxPrice: 6200,
      modalPrice: 6000,
      change: 200,
      changePercent: 3.4,
      timestamp: new Date().toISOString(),
    },
    {
      id: '5',
      state: 'Rajasthan',
      district: 'Jaipur',
      market: 'Jaipur Vegetable Market',
      commodity: 'Tomato',
      arrival: '2,100 quintals',
      minPrice: 1400,
      maxPrice: 2200,
      modalPrice: 1800,
      change: -100,
      changePercent: -5.3,
      timestamp: new Date().toISOString(),
    },
    {
      id: '6',
      state: 'Maharashtra',
      district: 'Nashik',
      market: 'Nashik Onion Market',
      commodity: 'Onion',
      arrival: '3,500 quintals',
      minPrice: 1100,
      maxPrice: 1500,
      modalPrice: 1300,
      change: 60,
      changePercent: 4.8,
      timestamp: new Date().toISOString(),
    },
    {
      id: '7',
      state: 'Punjab',
      district: 'Ludhiana',
      market: 'Ludhiana Grain Market',
      commodity: 'Rice',
      arrival: '4,200 quintals',
      minPrice: 3200,
      maxPrice: 3800,
      modalPrice: 3500,
      change: -50,
      changePercent: -1.4,
      timestamp: new Date().toISOString(),
    },
    {
      id: '8',
      state: 'Uttar Pradesh',
      district: 'Agra',
      market: 'Agra Vegetable Market',
      commodity: 'Chilly',
      arrival: '850 quintals',
      minPrice: 4500,
      maxPrice: 6800,
      modalPrice: 5500,
      change: 250,
      changePercent: 4.8,
      timestamp: new Date().toISOString(),
    },
  ];
  return mockData;
};

export default function MarketplacePage() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [filteredData, setFilteredData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    state: 'All States',
    district: 'All Districts',
    commodity: 'All Commodities',
    searchTerm: '',
  });

  // Initialize data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = generateMockData();
      setMarketData(data);
      setFilteredData(data);
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = marketData;

    if (filters.state !== 'All States') {
      filtered = filtered.filter((item) => item.state === filters.state);
    }

    if (filters.district !== 'All Districts' && filters.state !== 'All States') {
      filtered = filtered.filter((item) => item.district === filters.district);
    }

    if (filters.commodity !== 'All Commodities') {
      filtered = filtered.filter((item) => item.commodity === filters.commodity);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.market.toLowerCase().includes(searchLower) ||
          item.commodity.toLowerCase().includes(searchLower) ||
          item.district.toLowerCase().includes(searchLower)
      );
    }

    setFilteredData(filtered);
  }, [filters, marketData]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'state' && { district: 'All Districts' }), // Reset district when state changes
    }));
  };

  const getAvailableDistricts = () => {
    if (filters.state === 'All States') {
      return ['All Districts'];
    }
    return DISTRICTS[filters.state] || ['All Districts'];
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>🛒 भारतीय कृषि मंडी</h1>
            <p className={styles.heroSubtitle}>
              Real-time market prices from APMC across India
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className={styles.filtersSection}>
          <div className={styles.filtersContainer}>
            {/* Search Bar */}
            <div className={styles.searchBar}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by market, commodity, or district..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Filter Controls */}
            <div className={styles.filterControls}>
              <div className={styles.filterGroup}>
                <label htmlFor="state-select" className={styles.filterLabel}>
                  <Filter size={18} />
                  State
                </label>
                <select
                  id="state-select"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className={styles.filterSelect}
                >
                  {STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="district-select" className={styles.filterLabel}>District</label>
                <select
                  id="district-select"
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  className={styles.filterSelect}
                  disabled={filters.state === 'All States'}
                >
                  {getAvailableDistricts().map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="commodity-select" className={styles.filterLabel}>Commodity</label>
                <select
                  id="commodity-select"
                  value={filters.commodity}
                  onChange={(e) => handleFilterChange('commodity', e.target.value)}
                  className={styles.filterSelect}
                >
                  {COMMODITIES.map((commodity) => (
                    <option key={commodity} value={commodity}>
                      {commodity}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className={styles.resultsInfo}>
            <p className={styles.resultCount}>
              🔍 Found {filteredData.length} listings
            </p>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading market data...</p>
          </div>
        )}

        {/* Market Data Grid */}
        {!loading && (
          <>
            {filteredData.length > 0 ? (
              <section className={styles.gridContainer}>
                {filteredData.map((item) => (
                  <div key={item.id} className={styles.marketCard}>
                    {/* Card Header */}
                    <div className={styles.cardHeader}>
                      <div className={styles.headerLeft}>
                        <h3 className={styles.commodity}>{item.commodity}</h3>
                        <p className={styles.market}>{item.market}</p>
                      </div>
                      <div className={styles.location}>
                        <span className={styles.state}>{item.state}</span>
                        <span className={styles.district}>{item.district}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className={styles.cardBody}>
                      {/* Prices */}
                      <div className={styles.pricesSection}>
                        <div className={styles.priceGroup}>
                          <span className={styles.priceLabel}>Min Price</span>
                          <p className={styles.price}>₹{item.minPrice.toLocaleString()}</p>
                        </div>
                        <div className={styles.priceGroup}>
                          <span className={styles.priceLabel}>Modal Price</span>
                          <p className={styles.priceModal}>₹{item.modalPrice.toLocaleString()}</p>
                        </div>
                        <div className={styles.priceGroup}>
                          <span className={styles.priceLabel}>Max Price</span>
                          <p className={styles.price}>₹{item.maxPrice.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Change Indicator */}
                      {item.change !== undefined && (
                        <div className={`${styles.changeIndicator} ${item.change >= 0 ? styles.positive : styles.negative}`}>
                          {item.change >= 0 ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                          <span className={styles.changeValue}>
                            {item.change >= 0 ? '+' : ''}{item.changePercent}%
                          </span>
                        </div>
                      )}

                      {/* Arrival Info */}
                      <div className={styles.arrivalInfo}>
                        <span className={styles.arrivalLabel}>📦 Arrival:</span>
                        <span className={styles.arrivalValue}>{item.arrival}</span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className={styles.cardFooter}>
                      <button className={styles.contactBtn}>Get Details</button>
                      <button className={styles.tradeBtn}>Trade Now</button>
                    </div>
                  </div>
                ))}
              </section>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>No markets found</h3>
                <p className={styles.emptyText}>
                  Try adjusting your filters to find what you're looking for.
                </p>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <section className={styles.infoSection}>
          <h2 className={styles.infoTitle}>📊 About Mandi Prices</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🌾</div>
              <h4>Real-time Data</h4>
              <p>Updated prices from Agricultural Produce Market Committees (APMC) across India</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📍</div>
              <h4>Multiple States</h4>
              <p>Track prices across 28 states and union territories</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>💹</div>
              <h4>Price Trends</h4>
              <p>Monitor price changes and identify market opportunities</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🤝</div>
              <h4>Direct Trading</h4>
              <p>Connect directly with buyers and sellers in your region</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
