// models/Mission.js
// نموذج المهمات اليومية في قاعدة البيانات

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MissionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  reward: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['win', 'answer', 'play', 'social', 'custom'],
    required: true
  },
  target: {
    type: Number,
    required: true,
    min: 1
  },
  duration: {
    type: Number, // بالساعات
    default: 24
  },
  isDaily: {
    type: Boolean,
    default: true
  },
  isWeekly: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// قبل حفظ المهمة، تحديث وقت التعديل وتاريخ الانتهاء
MissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // تعيين تاريخ الانتهاء إذا لم يكن موجوداً
  if (!this.endDate) {
    const endDate = new Date(this.startDate);
    const hours = this.isWeekly ? 168 : this.duration; // 168 ساعة = أسبوع
    endDate.setHours(endDate.getHours() + hours);
    this.endDate = endDate;
  }
  
  next();
});

// إنشاء فهرس للبحث عن المهمات
MissionSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
MissionSchema.index({ isDaily: 1, isActive: 1 });
MissionSchema.index({ isWeekly: 1, isActive: 1 });

module.exports = mongoose.model('Mission', MissionSchema);
