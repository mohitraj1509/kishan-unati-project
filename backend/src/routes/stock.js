const express = require('express');
const router = express.Router();
const ShopStock = require('../models/ShopStock');

// Add new stock item
router.post('/stock', async (req, res) => {
  try {
    const { shopKeeperId, name, category, price, quantity, unit, description, discount } = req.body;

    if (!shopKeeperId || !name || !category || !price || !quantity || !unit) {
      return res.status(400).json({ message: 'कृपया सभी जरूरी जानकारी भरें' });
    }

    const stock = new ShopStock({
      shopKeeperId,
      name,
      category,
      price,
      quantity,
      unit,
      description,
      discount
    });

    await stock.save();

    res.status(201).json({
      message: 'सामान सफलतापूर्वक जोड़ा गया',
      stock
    });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ message: 'सामान जोड़ने में त्रुटि हुई' });
  }
});

// Get all stock for a shopkeeper
router.get('/stock/:shopKeeperId', async (req, res) => {
  try {
    const stocks = await ShopStock.find({
      shopKeeperId: req.params.shopKeeperId,
      isActive: true
    });

    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ message: 'स्टॉक लोड नहीं हो सका' });
  }
});

// Update stock item
router.put('/stock/:id', async (req, res) => {
  try {
    const { name, category, price, quantity, unit, description, discount } = req.body;

    const stock = await ShopStock.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price,
        quantity,
        unit,
        description,
        discount,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!stock) {
      return res.status(404).json({ message: 'सामान नहीं मिला' });
    }

    res.json({
      message: 'सामान सफलतापूर्वक अपडेट हो गया',
      stock
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'अपडेट में त्रुटि हुई' });
  }
});

// Delete stock item
router.delete('/stock/:id', async (req, res) => {
  try {
    const stock = await ShopStock.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!stock) {
      return res.status(404).json({ message: 'सामान नहीं मिला' });
    }

    res.json({ message: 'सामान सफलतापूर्वक डिलीट हो गया' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ message: 'डिलीट में त्रुटि हुई' });
  }
});

// Search stocks by name or category
router.get('/search', async (req, res) => {
  try {
    const { query, category } = req.query;

    let filter = { isActive: true };

    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    const stocks = await ShopStock.find(filter).populate('shopKeeperId', 'shopName location');

    res.json(stocks);
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ message: 'खोज में त्रुटि हुई' });
  }
});

module.exports = router;
