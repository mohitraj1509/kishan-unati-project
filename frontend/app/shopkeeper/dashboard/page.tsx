'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Percent, Calendar, TrendingUp, AlertCircle, ShoppingBag, BarChart3, Upload, Image, Video, X } from 'lucide-react';
import Header from '../../../components/Header';
import styles from './dashboard.module.css';

interface StockItem {
  id: string;
  name: string;
  category: string;
  company: string;
  price: number;
  quantity: number;
  unit: string;
  description: string;
  image?: string;
  discount?: number;
  expiryDate?: string;
  rating?: number;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
}

export default function ShopkeeperDashboard() {
  const [stocks, setStocks] = useState<StockItem[]>([
    {
      id: '1',
      name: 'Urea Fertilizer',
      category: 'Fertilizer',
      company: 'National Chemicals',
      price: 250,
      quantity: 50,
      unit: 'Bag (50kg)',
      description: '100% Pure Urea',
      discount: 5
    },
    {
      id: '2',
      name: 'Rice Seeds (Basmati)',
      category: 'Seeds',
      company: 'Agriculture Seeds',
      price: 45,
      quantity: 200,
      unit: 'kg',
      description: 'High quality seeds'
    }
  ]);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const [activeTab, setActiveTab] = useState<'stock' | 'media'>('stock');
  const [showModal, setShowModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<StockItem>({
    id: '',
    name: '',
    category: 'Fertilizer',
    company: '',
    price: 0,
    quantity: 0,
    unit: '',
    description: '',
    image: ''
  });
  const [mediaFormData, setMediaFormData] = useState<MediaItem>({
    id: '',
    type: 'image',
    url: '',
    title: '',
    description: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load and save media items to localStorage
  useEffect(() => {
    try {
      const savedMedia = localStorage.getItem('shopkeeper_media');
      if (savedMedia) {
        setMediaItems(JSON.parse(savedMedia));
      }
    } catch (error) {
      console.error('Failed to load media from localStorage:', error);
    }
  }, []);

  // Save media items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('shopkeeper_media', JSON.stringify(mediaItems));
      console.log('✅ Saved to localStorage:', mediaItems);
    } catch (error) {
      console.error('❌ Failed to save media to localStorage:', error);
    }
  }, [mediaItems]);

  const filteredStocks = stocks.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      id: '',
      name: '',
      category: 'Fertilizer',
      company: '',
      price: 0,
      quantity: 0,
      unit: '',
      description: '',
      image: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item: StockItem) => {
    setEditingId(item.id);
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.quantity) {
      alert('Please fill all required information');
      return;
    }

    if (editingId) {
      setStocks(stocks.map(item => item.id === editingId ? formData : item));
    } else {
      setStocks([...stocks, { ...formData, id: Date.now().toString() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Do you want to delete this item?')) {
      setStocks(stocks.filter(item => item.id !== id));
    }
  };

  // Media handlers
  const handleMediaAdd = () => {
    setMediaFormData({
      id: '',
      type: 'image',
      url: '',
      title: '',
      description: ''
    });
    setShowMediaModal(true);
  };

  const handleMediaSave = () => {
    if (!mediaFormData.url || !mediaFormData.title) {
      alert('Please enter URL and title');
      return;
    }

    setMediaItems([...mediaItems, { ...mediaFormData, id: Date.now().toString() }]);
    setShowMediaModal(false);
  };

  const handleMediaDelete = (id: string) => {
    if (confirm('Do you want to delete this media?')) {
      setMediaItems(mediaItems.filter(item => item.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Please upload only image or video files');
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size should not exceed 50MB');
      return;
    }

    // Convert file to data URL or upload to backend
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    reader.onload = () => {
      setMediaFormData({
        ...mediaFormData,
        type: isImage ? 'image' : 'video',
        url: reader.result as string
      });
      setUploadProgress(0);
    };

    reader.readAsDataURL(file);
  };

  const categories = ['Fertilizer', 'Seeds', 'Pesticide', 'Manure', 'Equipment', 'Others'];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = stocks.length;
    const totalValue = stocks.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const lowStockItems = stocks.filter(item => item.quantity < 10).length;
    const avgPrice = totalItems > 0 ? stocks.reduce((sum, item) => sum + item.price, 0) / totalItems : 0;
    
    return { totalItems, totalValue, lowStockItems, avgPrice };
  }, [stocks]);

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>📦 Stock Management Dashboard</h1>
          <p className={styles.subtitle}>Manage your agricultural products easily</p>
        </div>
        <button onClick={handleAdd} className={styles.addBtn} title="Add new product">
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dcfce7' }}>
            <Package size={24} color="#16a34a" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Products</p>
            <p className={styles.statValue}>{stats.totalItems}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dbeafe' }}>
            <BarChart3 size={24} color="#0369a1" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Value</p>
            <p className={styles.statValue}>₹{(stats.totalValue / 1000).toFixed(1)}k</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fef3c7' }}>
            <AlertCircle size={24} color="#b45309" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Low Stock</p>
            <p className={styles.statValue}>{stats.lowStockItems}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f3e8ff' }}>
            <TrendingUp size={24} color="#7c3aed" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Average Price</p>
            <p className={styles.statValue}>₹{stats.avgPrice.toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'stock' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <ShoppingBag size={20} />
          Stock Management
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'media' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('media')}
        >
          <Image size={20} />
          Gallery ({mediaItems.length})
        </button>
      </div>

      {/* Stock Tab */}
      {activeTab === 'stock' && (
        <>
      <div className={styles.searchBar}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Search product name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredStocks.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            {searchTerm ? 'No products found' : 'No products added yet'}
          </p>
          {!searchTerm && (
            <button onClick={handleAdd} className={styles.emptyBtn} title="Add first product">
              Add First Product
            </button>
          )}
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.col1}>Product Name</div>
            <div className={styles.col2}>Category</div>
            <div className={styles.col3}>Price</div>
            <div className={styles.col4}>Stock</div>
            <div className={styles.col5}>Actions</div>
          </div>

          {filteredStocks.map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <div className={styles.col1}>
                {item.image && (
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                )}
                <div>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemDesc}>{item.company || item.description}</div>
                </div>
              </div>
              <div className={styles.col2}>
                <span className={styles.category}>{item.category}</span>
              </div>
              <div className={styles.col3}>
                <span className={styles.price}>₹{item.price}</span>
                {item.discount && (
                  <span className={styles.discount}>
                    <Percent size={14} /> {item.discount}% Off
                  </span>
                )}
              </div>
              <div className={styles.col4}>
                <span className={styles.quantity}>{item.quantity} {item.unit}</span>
              </div>
              <div className={styles.col5}>
                <button
                  onClick={() => handleEdit(item)}
                  className={styles.editBtn}
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className={styles.deleteBtn}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {editingId ? '📝 Edit Product' : '➕ Add New Product'}
            </h2>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. - Urea Fertilizer"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={styles.select}
                  title="Select Category"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Company Name *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. - National Chemicals"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="Enter price"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Stock Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  placeholder="How much?"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Unit *</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g. - kg, bag, pack"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Discount (%) [Optional]</label>
                <input
                  type="number"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || undefined })}
                  placeholder="0"
                  className={styles.input}
                />
              </div>

              <div className={styles.fullWidth}>
                <label className={styles.label}>Description [Optional]</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Some information about this product..."
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.fullWidth}>
                <label className={styles.label}>Product Image [Optional]</label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Enter image URL (e.g. https://...)"
                  className={styles.input}
                />
                {formData.image && (
                  <div className={styles.imagePreview}>
                    <img src={formData.image} alt="Product image" />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleSave} className={styles.saveBtn}>
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <>
          <div className={styles.mediaHeader}>
            <h3>📸 Media Gallery - Photos and Videos</h3>
            <button 
              onClick={handleMediaAdd}
              className={styles.addMediaBtn}
            >
              <Upload size={18} />
              Add New Media
            </button>
          </div>

          {mediaItems.length > 0 ? (
            <div className={styles.mediaGallery}>
              {mediaItems.map((item) => (
                <div key={item.id} className={styles.mediaCard}>
                  <div className={styles.mediaPreview}>
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.title} className={styles.mediaImage} />
                    ) : (
                      <div className={styles.videoPlaceholder}>
                        <Video size={40} color="white" />
                      </div>
                    )}
                    {item.type === 'video' && (
                      <div className={styles.videoBadge}>Video</div>
                    )}
                  </div>
                  <div className={styles.mediaInfo}>
                    <h4 className={styles.mediaTitle}>{item.title}</h4>
                    <p className={styles.mediaDescription}>{item.description}</p>
                    <button
                      onClick={() => handleMediaDelete(item.id)}
                      className={styles.deleteMediaBtn}
                      title="Delete media"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyMedia}>
              <Image size={48} color="#ccc" />
              <p>No media yet</p>
              <p className={styles.emptyMediaSubtext}>Upload photos and videos of your crops, products and shop</p>
            </div>
          )}

          {/* Media Upload Modal */}
          {showMediaModal && (
            <div className={styles.modalOverlay} onClick={() => setShowMediaModal(false)}>
              <div className={styles.mediaModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>Upload New Media</h2>
                  <button 
                    onClick={() => setShowMediaModal(false)}
                    className={styles.closeBtn}
                    title="Close"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className={styles.mediaFormGroups}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Media Type</label>
                    <div className={styles.typeSelector}>
                      <button
                        className={`${styles.typeBtn} ${mediaFormData.type === 'image' ? styles.activeType : ''}`}
                        onClick={() => setMediaFormData({ ...mediaFormData, type: 'image' })}
                      >
                        <Image size={18} />
                        Image
                      </button>
                      <button
                        className={`${styles.typeBtn} ${mediaFormData.type === 'video' ? styles.activeType : ''}`}
                        onClick={() => setMediaFormData({ ...mediaFormData, type: 'video' })}
                      >
                        <Video size={18} />
                        Video
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>URL Link</label>
                    <input
                      type="url"
                      placeholder={mediaFormData.type === 'image' ? 'Image URL (e.g. https://...)' : 'Video URL (YouTube, Vimeo, etc.)'}
                      value={mediaFormData.url}
                      onChange={(e) => setMediaFormData({ ...mediaFormData, url: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.divider}>
                    <span>or</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Upload File</label>
                    <div className={styles.fileUploadArea}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="media-file-upload"
                        accept={mediaFormData.type === 'image' ? 'image/*' : 'video/*'}
                        onChange={handleFileUpload}
                        className={styles.fileInput}
                        title={mediaFormData.type === 'image' ? 'Upload image file' : 'Upload video file'}
                      />
                      <label htmlFor="media-file-upload" className={styles.uploadButton}>
                        <Upload size={24} />
                        <span>Choose File</span>
                      </label>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progress}
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                      {mediaFormData.url && (
                        <div className={styles.filePreview}>
                          <p>✅ File successfully selected</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Title*</label>
                    <input
                      type="text"
                      placeholder="e.g.: Our wheat crop"
                      value={mediaFormData.title}
                      onChange={(e) => setMediaFormData({ ...mediaFormData, title: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description [Optional]</label>
                    <textarea
                      placeholder="Some information about this photo/video..."
                      value={mediaFormData.description}
                      onChange={(e) => setMediaFormData({ ...mediaFormData, description: e.target.value })}
                      className={styles.textarea}
                      rows={3}
                    />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button onClick={() => setShowMediaModal(false)} className={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button onClick={handleMediaSave} className={styles.saveBtn}>
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
