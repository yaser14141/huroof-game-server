// models/Game.js
// نموذج اللعبة في قاعدة البيانات

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new mongoose.Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  players: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    team: {
      type: String,
      enum: ['team1', 'team2'],
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    wrongAnswers: {
      type: Number,
      default: 0
    }
  }],
  rounds: [{
    number: {
      type: Number,
      required: true
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    },
    answers: [{
      player: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      answer: {
        type: String,
        trim: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      },
      answerTime: {
        type: Number // بالثواني
      },
      answeredAt: {
        type: Date
      }
    }],
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    winningTeam: {
      type: String,
      enum: [null, 'team1', 'team2'],
      default: null
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: {
      type: Date,
      default: null
    }
  }],
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
  winner: {
    type: String,
    enum: [null, 'team1', 'team2'],
    default: null
  },
  status: {
    type: String,
    enum: ['playing', 'finished'],
    default: 'playing'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // بالثواني
    default: 0
  }
});

// قبل حفظ اللعبة، حساب المدة إذا انتهت اللعبة
GameSchema.pre('save', function(next) {
  if (this.status === 'finished' && this.endedAt && !this.duration) {
    this.duration = Math.floor((this.endedAt - this.startedAt) / 1000);
  }
  next();
});

// إنشاء فهرس للبحث عن الألعاب حسب الغرفة والحالة
GameSchema.index({ room: 1, status: 1 });
GameSchema.index({ 'players.user': 1 });

module.exports = mongoose.model('Game', GameSchema);
