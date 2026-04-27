const express = require('express');
const router = express.Router();
const News = require('../models/News');
const authMiddleware = require('../middleware/authMiddleware');

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single news by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new news (Protected route)
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, images, author } = req.body;

  // Validation
  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Title, content, and author are required' });
  }

  const news = new News({
    title,
    content,
    images: images || [],
    author,
  });

  try {
    const newNews = await news.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update news by ID (Protected route)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    if (req.body.title) news.title = req.body.title;
    if (req.body.content) news.content = req.body.content;
    if (req.body.images !== undefined) news.images = req.body.images;
    if (req.body.author) news.author = req.body.author;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete news by ID (Protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
