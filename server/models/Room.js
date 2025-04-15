// models/Room.js
// نموذج الغرفة في قاعدة البيانات

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  type: {
    type: String,
    enum: ['public', 'private', 'code'],
    default: 'public'
  },
  code: {
    type: String,
    sparse: true,
    trim: true
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxPlayers: {
    type: Number,
    default: 8,
    min: 2,
    max: 16
  },
  answerTime: {
    type: Number,
    default: 30,
    min: 10,
    max: 120
  },
  penaltyTime: {
    type: Number,
    default: 10,
    min: 0,
    max: 60
  },
  teamColors: {
    team1: {
      type: String,
      default: '#FF5555'
    },
    team2: {
      type: String,
      default: '#5555FF'
    }
  },
  players: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    team: {
      type: String,
      enum: [null, 'team1', 'team2'],
      default: null
    },
    isHost: {
      type: Boolean,
      default: false
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  teams: {
    team1: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    team2: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  gameState: {
    status: {
      type: String,
      enum: ['waiting', 'playing', 'finished'],
      default: 'waiting'
    },
    currentQuestion: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      default: null
    },
    currentPlayer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    hexGrid: {
      type: Object,
      default: {}
    },
    scores: {
      team1: {
        type: Number,
        default: 0
      },
      team2: {
        type: Number,
        default: 0
      }
    },
    startedAt: {
      type: Date,
      default: null
    },
    endedAt: {
      type: Date,
      default: null
    }
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

// قبل حفظ الغرفة، تحديث وقت التعديل
RoomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// إنشاء فهرس للبحث عن الغرف العامة
RoomSchema.index({ type: 1, 'gameState.status': 1 });

module.exports = mongoose.model('Room', RoomSchema);
