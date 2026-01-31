'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Phone, Clock, Star, Package, ShoppingCart, Share2, Image, Video } from 'lucide-react';
import styles from './shop.module.css';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  unit: string;
  description: string;
  discount?: number;
  rating?: number;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
}

const shopDetails = {
  '1': {
    id: '1',
    name: 'राज कृषि भंडार',
    location: 'मुख्य बाज़ार, जन्नत पुर',
    distance: 2.3,
    phone: '+91-9876543210',
    timings: '6 AM - 8 PM',
    rating: 4.5,
    reviews: 234,
    ownerName: 'राज कुमार शर्मा',
    icon: '🌾',
    media: [],
    products: [
      {
        id: 'p1',
        name: 'यूरिया खाद',
        category: 'खाद',
        price: 250,
        originalPrice: 280,
        quantity: 50,
        unit: 'बोरी (50kg)',
        description: '100% शुद्ध यूरिया - खेत के लिए सर्वश्रेष्ठ',
        discount: 10,
        rating: 4.8
      },
      {
        id: 'p2',
        name: 'धान के बीज (बासमती)',
        category: 'बीज',
        price: 45,
        quantity: 200,
        unit: 'kg',
        description: 'उच्च गुणवत्ता के बासमती बीज',
        rating: 4.6
      },
      {
        id: 'p3',
        name: 'DAP खाद',
        category: 'खाद',
        price: 300,
        originalPrice: 350,
        quantity: 30,
        unit: 'बोरी (50kg)',
        description: 'डाई अमोनियम फॉस्फेट',
        discount: 14,
        rating: 4.7
      },
      {
        id: 'p4',
        name: 'कीटनाशक (नीम)',
        category: 'कीटनाशक',
        price: 120,
        quantity: 100,
        unit: 'लीटर',
        description: 'जैविक कीटनाशक - 100% प्राकृतिक',
        rating: 4.5
      }
    ]
  }
};

export default function ShopDetail() {
  const params = useParams();
  const shopId = params.id as string;
  const shop = shopDetails[shopId as keyof typeof shopDetails];
  const [cartCount, setCartCount] = useState(0);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(shop?.media || []);

  // Load uploaded media from localStorage
  useEffect(() => {
    try {
      const savedMedia = localStorage.getItem('shopkeeper_media');
      if (savedMedia) {
        const parsedMedia = JSON.parse(savedMedia);
        console.log('✅ Loaded media from localStorage:', parsedMedia);
        setMediaItems(parsedMedia);
      } else {
        console.log('⚠️ No media found in localStorage');
        setMediaItems([]);
      }
    } catch (error) {
      console.error('❌ Failed to load media from localStorage:', error);
      setMediaItems([]);
    }
  }, []);

  if (!shop) {
    return <div className={styles.notFound}>दुकान नहीं मिली</div>;
  }

  const handleAddCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className={styles.container}>
      {/* Shop Header */}
      <div className={styles.header}>
        <div className={styles.shopHeader}>
          <span className={styles.shopIcon}>{shop.icon}</span>
          <div className={styles.shopInfo}>
            <h1 className={styles.shopName}>{shop.name}</h1>
            <div className={styles.ratingSection}>
              <div className={styles.stars}>
                {'⭐'.repeat(Math.floor(shop.rating))}
                <span className={styles.rating}>{shop.rating}</span>
              </div>
              <span className={styles.reviews}>({shop.reviews} समीक्षा)</span>
            </div>
          </div>
          <button className={styles.shareBtn}>
            <Share2 size={20} />
            शेयर करें
          </button>
        </div>

        <div className={styles.details}>
          <div className={styles.detail}>
            <MapPin size={18} />
            <div>
              <p className={styles.label}>स्थान</p>
              <p className={styles.value}>{shop.location}</p>
              <p className={styles.distance}>{shop.distance} km दूर</p>
            </div>
          </div>

          <div className={styles.detail}>
            <Phone size={18} />
            <div>
              <p className={styles.label}>फ़ोन</p>
              <a href={`tel:${shop.phone}`} className={styles.phone}>
                {shop.phone}
              </a>
            </div>
          </div>

          <div className={styles.detail}>
            <Clock size={18} />
            <div>
              <p className={styles.label}>खुलने का समय</p>
              <p className={styles.value}>{shop.timings}</p>
            </div>
          </div>

          <div className={styles.detail}>
            <User size={18} />
            <div>
              <p className={styles.label}>मालिक</p>
              <p className={styles.value}>{shop.ownerName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Media Gallery Section */}
      {mediaItems && mediaItems.length > 0 ? (
        <div className={styles.mediaSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🎥 हमारी गैलरी</h2>
            <span className={styles.productCount}>{mediaItems.length} तस्वीरें</span>
          </div>

          <div className={styles.mediaGallery}>
            {mediaItems.map((item) => (
              <div key={item.id} className={styles.mediaCard}>
                <div className={styles.mediaPreview}>
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.title} className={styles.mediaImage} />
                  ) : item.type === 'video' ? (
                    <div className={styles.videoPlaceholder}>
                      <Video size={40} color="white" />
                    </div>
                  ) : null}
                  {(item as MediaItem).type === 'video' && (
                    <div className={styles.videoBadge}>वीडियो</div>
                  )}
                </div>
                <div className={styles.mediaInfo}>
                  <h4 className={styles.mediaTitle}>{item.title}</h4>
                  <p className={styles.mediaDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
          <p>अभी कोई गैलरी उपलब्ध नहीं है</p>
        </div>
      )}

      {/* Products Section */}
      <div className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📦 उपलब्ध सामान</h2>
          <span className={styles.productCount}>{shop.products.length} चीज़ें</span>
        </div>

        <div className={styles.productsGrid}>
          {shop.products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              {product.discount && (
                <div className={styles.discountBadge}>{product.discount}% छूट</div>
              )}

              <div className={styles.productHeader}>
                <h3 className={styles.productName}>{product.name}</h3>
                <span className={styles.category}>{product.category}</span>
              </div>

              <p className={styles.description}>{product.description}</p>

              <div className={styles.pricing}>
                <div>
                  <p className={styles.priceLabel}>कीमत</p>
                  <p className={styles.price}>₹{product.price}</p>
                  {product.originalPrice && (
                    <p className={styles.originalPrice}>₹{product.originalPrice}</p>
                  )}
                </div>
                {product.rating && (
                  <div className={styles.rating2}>
                    <p className={styles.ratingLabel}>रेटिंग</p>
                    <p className={styles.ratingValue}>⭐ {product.rating}</p>
                  </div>
                )}
              </div>

              <div className={styles.stock}>
                <Package size={16} />
                <span>{product.quantity} {product.unit} उपलब्ध</span>
              </div>

              <button onClick={handleAddCart} className={styles.addToCartBtn}>
                <ShoppingCart size={18} />
                कार्ट में जोड़ें
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Floating Button */}
      {cartCount > 0 && (
        <div className={styles.floatingCart}>
          <ShoppingCart size={24} />
          <span className={styles.cartCount}>{cartCount}</span>
          <button className={styles.viewCartBtn}>कार्ट देखें</button>
        </div>
      )}
    </div>
  );
}

// Icon component placeholder
const User = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
