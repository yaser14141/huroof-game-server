// models/Replay.js
// نموذج إعادة المشاهدة في قاعدة البيانات

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplaySchema = new mongoose.Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: function() {
      return `إعادة مشاهدة ${new Date().toISOString().split('T')[0]}`;
    }
  },
  description: {
    type: String,
    trim: true
  },
  events: [{
    type: {
      type: String,
      required: true,
      enum: [
        'game_start',
        'round_start',
        'player_answer',
        'round_end',
        'cell_capture',
        'game_end',
        'chat_message',
        'player_join',
        'player_leave',
        'team_change'
      ]
    },
    timestamp: {
      type: Date,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  }],
  duration: {
    type: Number, // بالثواني
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// إنشاء فهرس للبحث عن إعادات المشاهدة
ReplaySchema.index({ creator: 1, createdAt: -1 });
ReplaySchema.index({ game: 1 });
ReplaySchema.index({ isPublic: 1, createdAt: -1 });
ReplaySchema.index({ tags: 1 });

module.exports = mongoose.model('Replay', ReplaySchema);
