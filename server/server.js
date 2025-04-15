// server.js
// الملف الرئيسي للسيرفر

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const apiRoutes = require('./api');
const { registerSocketHandlers } = require('./utils/socketHandlers');

// إنشاء تطبيق Express
const app = express();
const server = http.createServer(app);

// إعداد CORS
app.use(cors());
app.use(express.json());

// إعداد المجلد الثابت للملفات العامة
app.use(express.static(path.join(__dirname, 'public')));

// إعداد مسارات API
app.use('/api', apiRoutes);

// إعداد Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// تسجيل معالجات الأحداث لـ Socket.IO
registerSocketHandlers(io);

// توجيه جميع الطلبات المتبقية إلى تطبيق React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
  console.log(`البيئة: ${process.env.NODE_ENV || 'development'}`);
  console.log(`الوقت: ${new Date().toISOString()}`);
});
