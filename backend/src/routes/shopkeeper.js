const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const ShopKeeper = require('../models/ShopKeeper');

// Register Shopkeeper
router.post('/register-shopkeeper', async (req, res) => {
  try {
    const { shopName, ownerName, phone, location, state, district, password, confirmPassword } = req.body;

    // Validate required fields
    if (!shopName || !ownerName || !phone || !location || !password) {
      return res.status(400).json({ message: 'कृपया सभी जरूरी जानकारी भरें' });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'पासवर्ड मेल नहीं खा रहे हैं' });
    }

    // Validate phone
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: 'कृपया 10 अंकों का फ़ोन नंबर दर्ज करें' });
    }

    // Check if shopkeeper already exists
    const existingShopKeeper = await ShopKeeper.findOne({ phone });
    if (existingShopKeeper) {
      return res.status(400).json({ message: 'यह फ़ोन नंबर पहले से रजिस्टर्ड है' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new shopkeeper
    const shopKeeper = new ShopKeeper({
      shopName,
      ownerName,
      phone,
      location,
      state,
      district,
      password: hashedPassword
    });

    await shopKeeper.save();

    res.status(201).json({
      message: 'दुकान सफलतापूर्वक रजिस्टर्ड हो गई',
      shopKeeper: shopKeeper.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'रजिस्ट्रेशन में त्रुटि हुई' });
  }
});

// Login Shopkeeper
router.post('/login-shopkeeper', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'फ़ोन और पासवर्ड दोनों दर्ज करें' });
    }

    const shopKeeper = await ShopKeeper.findOne({ phone });
    if (!shopKeeper) {
      return res.status(401).json({ message: 'फ़ोन नंबर या पासवर्ड गलत है' });
    }

    const isPasswordValid = await bcrypt.compare(password, shopKeeper.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'फ़ोन नंबर या पासवर्ड गलत है' });
    }

    res.json({
      message: 'लॉगिन सफल',
      shopKeeper: shopKeeper.toJSON(),
      token: 'your-jwt-token-here' // Implement JWT in real app
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'लॉगिन में त्रुटि हुई' });
  }
});

// Get all shopkeepers (for nearest shops)
router.get('/shopkeepers', async (req, res) => {
  try {
    const shopKeepers = await ShopKeeper.find({ isActive: true })
      .select('-password')
      .limit(20);

    res.json(shopKeepers);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'डेटा लोड नहीं हो सका' });
  }
});

// Get shopkeeper by ID
router.get('/shopkeepers/:id', async (req, res) => {
  try {
    const shopKeeper = await ShopKeeper.findById(req.params.id).select('-password');

    if (!shopKeeper) {
      return res.status(404).json({ message: 'दुकान नहीं मिली' });
    }

    res.json(shopKeeper);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'डेटा लोड नहीं हो सका' });
  }
});

module.exports = router;
