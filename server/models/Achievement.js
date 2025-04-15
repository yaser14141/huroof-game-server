// models/Achievement.js
// نموذج الإنجازات في قاعدة البيانات

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AchievementSchema = new mongoose.Schema({
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
  icon: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'gameplay', 'social', 'special'],
    default: 'general'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'legendary'],
    default: 'medium'
  },
  requirement: {
    type: {
      type: String,
      enum: ['win_games', 'answer_questions', 'play_games', 'add_questions', 'play_with_players', 'custom'],
      required: true
    },
    count: {
      type: Number,
      required: true,
      min: 1
    },
    additionalData: {
      type: Object
    }
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
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

// قبل حفظ الإنجاز، تحديث وقت التعديل
AchievementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// إنشاء فهرس للبحث عن الإنجازات
AchievementSchema.index({ category: 1, difficulty: 1 });
AchievementSchema.index({ isActive: 1 });

module.exports = mongoose.model('Achievement', AchievementSchema);
