// models/Feedback.js
// نموذج تقييم اللاعبين في قاعدة البيانات

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  satisfaction: {
    type: String,
    enum: ['happy', 'neutral', 'unhappy'],
    required: true
  },
  questionAnswers: {
    gameplay: {
      type: String,
      enum: ['ممتازة', 'جيدة', 'متوسطة', 'تحتاج تحسين']
    },
    difficulty: {
      type: String,
      enum: ['سهلة جداً', 'مناسبة', 'صعبة قليلاً', 'صعبة جداً']
    },
    ui: {
      type: String,
      enum: ['ممتازة', 'جيدة', 'متوسطة', 'تحتاج تحسين']
    }
  },
  feedback: {
    type: String,
    trim: true
  },
  isReviewed: {
    type: Boolean,
    default: false
  },
  adminResponse: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// إنشاء فهرس للبحث عن التقييمات
FeedbackSchema.index({ user: 1, createdAt: -1 });
FeedbackSchema.index({ rating: 1 });
FeedbackSchema.index({ isReviewed: 1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);
