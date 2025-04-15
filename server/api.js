// routes/api.js
// مسارات API للتطبيق

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { generateHexGrid, shuffleHexGrid } = require('./utils/gameHelpers');
const config = require('../config');
const verifyToken = require('../middleware/verifyToken');

// الحصول على معلومات السيرفر
router.get('/info', (req, res) => {
  res.json({
    name: 'حروف مع ياسر API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// الحصول على قائمة الغرف العامة
router.get('/rooms', (req, res) => {
  try {
    const roomsList = Object.values(global.rooms || {})
      .filter(room => room.type === 'public')
      .map(room => ({
        id: room.id,
        name: room.name,
        type: room.type,
        hostName: room.hostName,
        maxPlayers: room.maxPlayers,
        players: room.players.length,
        gameState: {
          status: room.gameState.status
        },
        createdAt: room.createdAt
      }));
    
    res.json({ success: true, rooms: roomsList });
  } catch (error) {
    console.error('خطأ في جلب قائمة الغرف:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب قائمة الغرف' });
  }
});

// إنشاء شبكة سداسية جديدة
router.post('/hexgrid/generate', (req, res) => {
  try {
    const { rows, cols } = req.body;
    
    const grid = generateHexGrid(
      rows || config.game.hexGridSize.rows,
      cols || config.game.hexGridSize.cols,
      config.game.arabicLetters
    );
    
    res.json({ success: true, grid });
  } catch (error) {
    console.error('خطأ في إنشاء شبكة سداسية:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء شبكة سداسية' });
  }
});

// إعادة ترتيب الحروف في الشبكة السداسية
router.post('/hexgrid/shuffle', (req, res) => {
  try {
    const { grid } = req.body;
    
    if (!grid) {
      return res.status(400).json({ error: 'يجب توفير الشبكة السداسية' });
    }
    
    const newGrid = shuffleHexGrid(grid, config.game.arabicLetters);
    
    res.json({ success: true, grid: newGrid });
  } catch (error) {
    console.error('خطأ في إعادة ترتيب الحروف:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إعادة ترتيب الحروف' });
  }
});

// 🛡️ مسار محمي لاختبار التوكن
router.get('/me', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'تم التحقق من التوكن بنجاح ✅',
    userId: req.userId
  });
});

module.exports = router;
