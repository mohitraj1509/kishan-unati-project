"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Marketplace.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  seller: string;
  location: string;
  rating: number;
  image: string;
  category: string;
  description: string;
  stock: number;
}

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{[key: number]: number}>({});

  const categories = ['All', 'Crops', 'Seeds', 'Fertilizers', 'Equipment', 'Tools'];

  useEffect(() => {
    // Mock marketplace data
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Premium Wheat Seeds',
          price: 2500,
          unit: 'kg',
          seller: 'AgriSeeds Ltd',
          location: 'Punjab',
          rating: 4.8,
          image: '🌾',
          category: 'Seeds',
          description: 'High-yield wheat seeds suitable for all soil types',
          stock: 500
        },
        {
          id: 2,
          name: 'Organic Fertilizer',
          price: 1800,
          unit: 'bag',
          seller: 'GreenGrow Farms',
          location: 'Haryana',
          rating: 4.6,
          image: '🌱',
          category: 'Fertilizers',
          description: '100% organic fertilizer for sustainable farming',
          stock: 200
        },
        {
          id: 3,
          name: 'Rice Harvest',
          price: 3200,
          unit: 'quintal',
          seller: 'RiceCo Farmers',
          location: 'West Bengal',
          rating: 4.9,
          image: '🌾',
          category: 'Crops',
          description: 'Premium basmati rice, freshly harvested',
          stock: 100
        },
        {
          id: 4,
          name: 'Tractor Attachment',
          price: 45000,
          unit: 'piece',
          seller: 'FarmTech Solutions',
          location: 'Maharashtra',
          rating: 4.7,
          image: '🚜',
          category: 'Equipment',
          description: 'Multi-purpose tractor attachment for various farming tasks',
          stock: 15
        },
        {
          id: 5,
          name: 'Cotton Seeds',
          price: 3500,
          unit: 'kg',
          seller: 'CottonKing Seeds',
          location: 'Gujarat',
          rating: 4.5,
          image: '🌿',
          category: 'Seeds',
          description: 'High-quality cotton seeds with excellent fiber quality',
          stock: 300
        },
        {
          id: 6,
          name: 'Garden Tools Set',
          price: 2500,
          unit: 'set',
          seller: 'ToolMaster',
          location: 'Delhi',
          rating: 4.4,
          image: '🔧',
          category: 'Tools',
          description: 'Complete set of essential gardening and farming tools',
          stock: 50
        }
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <h2>Loading Marketplace...</h2>
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
        <h1 className={styles.title}>Farmers Marketplace</h1>
        <p className={styles.subtitle}>Buy and sell agricultural products with fellow farmers</p>
      </div>

      {/* Search and Filters */}
      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search products, sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.categoryFilters}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <span className={styles.cartIcon}>🛒</span>
          <span className={styles.cartCount}>{getTotalItems()}</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className={styles.productsGrid}>
        {filteredProducts.map(product => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImage}>
              <span className={styles.emoji}>{product.image}</span>
            </div>

            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>

              <div className={styles.productDetails}>
                <div className={styles.detail}>
                  <span className={styles.label}>Seller:</span>
                  <span className={styles.value}>{product.seller}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Location:</span>
                  <span className={styles.value}>{product.location}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Rating:</span>
                  <span className={styles.value}>⭐ {product.rating}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Stock:</span>
                  <span className={styles.value}>{product.stock} {product.unit}</span>
                </div>
              </div>

              <div className={styles.productFooter}>
                <div className={styles.price}>
                  ₹{product.price.toLocaleString()}<span className={styles.unit}>/{product.unit}</span>
                </div>

                <div className={styles.cartControls}>
                  {cart[product.id] ? (
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => removeFromCart(product.id)}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{cart[product.id]}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => addToCart(product.id)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.addToCartBtn}
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Cart Summary */}
      {getTotalItems() > 0 && (
        <div className={styles.cartSummaryBar}>
          <div className={styles.cartInfo}>
            <span>{getTotalItems()} items in cart</span>
          </div>
          <button className={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;