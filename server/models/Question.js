// models/Question.js
// نموذج السؤال في قاعدة البيانات

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  letter: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1
  },
  answers: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  timeLimit: {
    type: Number,
    default: 30,
    min: 10,
    max: 120
  },
  points: {
    type: Number,
    default: 10,
    min: 1
  },
  hint: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  correctAnswerCount: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
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

// قبل حفظ السؤال، تحديث وقت التعديل
QuestionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// إنشاء فهرس للبحث عن الأسئلة حسب الحرف والصعوبة
QuestionSchema.index({ letter: 1, difficulty: 1, isApproved: 1 });
QuestionSchema.index({ category: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
