// config/db.js
// تكوين الاتصال بقاعدة البيانات

const mongoose = require('mongoose');

// الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/huroof-game', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`تم الاتصال بقاعدة البيانات: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`خطأ في الاتصال بقاعدة البيانات: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
