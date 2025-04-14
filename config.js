// config.js
// ملف التكوين للسيرفر

module.exports = {
  // إعدادات الخادم
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || '0.0.0.0',
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  },
  
  // إعدادات اللعبة
  game: {
    defaultMaxPlayers: 4,
    defaultAnswerTime: 30,
    defaultPenaltyTime: 10,
    defaultTeamColors: {
      team1: '#FF5555',
      team2: '#5555FF'
    },
    hexGridSize: {
      rows: 5,
      cols: 5
    },
    arabicLetters: [
      'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
    ]
  },
  
  // إعدادات الأمان
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'huroof-game-secret-key',
    tokenExpiration: '24h'
  },
  
  // إعدادات البيئة
  environment: {
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production'
  }
};
