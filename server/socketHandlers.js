// utils/socketHandlers.js
// معالجات الأحداث لـ Socket.IO

const { v4: uuidv4 } = require('uuid');
const config = require('./config');
const { generateHexGrid, shuffleHexGrid, updateTeamColors, checkWinCondition } = require('./gameHelpers');

// تخزين بيانات الغرف واللاعبين
const rooms = {};
const players = {};

/**
 * تسجيل معالجات الأحداث لـ Socket.IO
 * @param {Object} io كائن Socket.IO
 */
function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`مستخدم جديد متصل: ${socket.id}`);
    
    // تسجيل اللاعب
    socket.on('player:register', handlePlayerRegister(socket));
    
    // جلب قائمة الغرف
    socket.on('rooms:get', handleGetRooms(socket));
    
    // إنشاء غرفة جديدة
    socket.on('room:create', handleCreateRoom(socket, io));
    
    // الانضمام إلى غرفة
    socket.on('room:join', handleJoinRoom(socket, io));
    
    // مغادرة الغرفة
    socket.on('room:leave', handleLeaveRoom(socket, io));
    
    // توزيع اللاعبين على الفرق
    socket.on('teams:assign', handleAssignTeams(socket, io));
    
    // توزيع اللاعبين على الفرق بشكل عشوائي
    socket.on('teams:random', handleRandomTeams(socket, io));
    
    // بدء اللعبة
    socket.on('game:start', handleStartGame(socket, io));
    
    // إعادة ترتيب الحروف
    socket.on('game:shuffle', handleShuffleGame(socket, io));
    
    // تغيير ألوان الفرق
    socket.on('game:colors', handleChangeColors(socket, io));
    
    // إعلان الفوز
    socket.on('game:win', handleAnnounceWin(socket, io));
    
    // قطع الاتصال
    socket.on('disconnect', handleDisconnect(socket, io));
  });
  
  // جعل الغرف واللاعبين متاحين عالمياً للوصول من المسارات
  global.rooms = rooms;
  global.players = players;
}

/**
 * معالج تسجيل اللاعب
 */
function handlePlayerRegister(socket) {
  return (userData, callback) => {
    try {
      const playerId = userData.id || socket.id;
      
      // تخزين بيانات اللاعب
      players[playerId] = {
        id: playerId,
        socketId: socket.id,
        username: userData.username,
        status: 'online',
        team: null,
        room: null,
        createdAt: new Date().toISOString()
      };
      
      console.log(`تم تسجيل اللاعب: ${userData.username} (${playerId})`);
      
      // إرسال تأكيد التسجيل
      callback({ success: true, player: players[playerId] });
    } catch (error) {
      console.error('خطأ في تسجيل اللاعب:', error);
      callback({ error: 'حدث خطأ أثناء تسجيل اللاعب' });
    }
  };
}

/**
 * معالج جلب قائمة الغرف
 */
function handleGetRooms(socket) {
  return (callback) => {
    try {
      // تحويل كائن الغرف إلى مصفوفة
      const roomsList = Object.values(rooms)
        .filter(room => room.type === 'public') // فقط الغرف العامة
        .map(room => ({
          id: room.id,
          name: room.name,
          type: room.type,
          hostName: room.hostName,
          maxPlayers: room.maxPlayers,
          players: room.players.length,
          gameState: {
            status: room.gameState.status
          },
          createdAt: room.createdAt
        }));
      
      callback({ success: true, rooms: roomsList });
    } catch (error) {
      console.error('خطأ في جلب قائمة الغرف:', error);
      callback({ error: 'حدث خطأ أثناء جلب قائمة الغرف' });
    }
  };
}

/**
 * معالج إنشاء غرفة جديدة
 */
function handleCreateRoom(socket, io) {
  return (roomData, callback) => {
    try {
      const roomId = uuidv4();
      const hostId = roomData.hostId || socket.id;
      
      // التحقق من وجود اللاعب
      if (!players[hostId]) {
        return callback({ error: 'يجب تسجيل اللاعب أولاً' });
      }
      
      // إنشاء الغرفة
      const newRoom = {
        id: roomId,
        name: roomData.name,
        type: roomData.type || 'public',
        hostId: hostId,
        hostName: roomData.hostName || players[hostId].username,
        maxPlayers: roomData.maxPlayers || config.game.defaultMaxPlayers,
        answerTime: roomData.answerTime || config.game.defaultAnswerTime,
        penaltyTime: roomData.penaltyTime || config.game.defaultPenaltyTime,
        teamColors: roomData.teamColors || config.game.defaultTeamColors,
        players: [],
        teams: {
          team1: [],
          team2: []
        },
        gameState: {
          status: 'waiting',
          currentQuestion: null,
          currentPlayer: null,
          hexGrid: generateHexGrid(
            config.game.hexGridSize.rows,
            config.game.hexGridSize.cols,
            config.game.arabicLetters
          ),
          scores: {}
        },
        createdAt: new Date().toISOString()
      };
      
      // تخزين الغرفة
      rooms[roomId] = newRoom;
      
      // إضافة المضيف إلى الغرفة
      players[hostId].room = roomId;
      players[hostId].team = null; // المضيف ليس في فريق بعد
      rooms[roomId].players.push({
        id: hostId,
        username: players[hostId].username,
        team: null,
        isHost: true
      });
      
      // الانضمام إلى غرفة Socket.IO
      socket.join(roomId);
      
      console.log(`تم إنشاء غرفة جديدة: ${roomData.name} (${roomId})`);
      
      // إرسال تأكيد إنشاء الغرفة
      callback({ 
        success: true, 
        room: rooms[roomId],
        players: rooms[roomId].players
      });
      
      // تحديث قائمة الغرف للجميع
      updateRoomsList(io);
    } catch (error) {
      console.error('خطأ في إنشاء الغرفة:', error);
      callback({ error: 'حدث خطأ أثناء إنشاء الغرفة' });
    }
  };
}

/**
 * معالج الانضمام إلى غرفة
 */
function handleJoinRoom(socket, io) {
  return (data, callback) => {
    try {
      const { roomId } = data;
      const playerId = data.playerId || socket.id;
      
      // التحقق من وجود الغرفة
      if (!rooms[roomId]) {
        return callback({ error: 'الغرفة غير موجودة' });
      }
      
      // التحقق من وجود اللاعب
      if (!players[playerId]) {
        return callback({ error: 'يجب تسجيل اللاعب أولاً' });
      }
      
      // التحقق من عدد اللاعبين
      if (rooms[roomId].players.length >= rooms[roomId].maxPlayers) {
        return callback({ error: 'الغرفة ممتلئة' });
      }
      
      // التحقق من حالة اللعبة
      if (rooms[roomId].gameState.status !== 'waiting') {
        return callback({ error: 'اللعبة قيد التقدم بالفعل' });
      }
      
      // إضافة اللاعب إلى الغرفة
      players[playerId].room = roomId;
      players[playerId].team = null; // اللاعب ليس في فريق بعد
      rooms[roomId].players.push({
        id: playerId,
        username: players[playerId].username,
        team: null,
        isHost: false
      });
      
      // الانضمام إلى غرفة Socket.IO
      socket.join(roomId);
      
      console.log(`انضم اللاعب ${players[playerId].username} إلى الغرفة ${rooms[roomId].name}`);
      
      // إرسال تأكيد الانضمام
      callback({ 
        success: true, 
        room: rooms[roomId],
        players: rooms[roomId].players,
        gameState: rooms[roomId].gameState
      });
      
      // إعلام جميع اللاعبين في الغرفة بانضمام لاعب جديد
      socket.to(roomId).emit('player:joined', {
        id: playerId,
        username: players[playerId].username,
        team: null,
        isHost: false
      });
      
      // تحديث قائمة الغرف للجميع
      updateRoomsList(io);
    } catch (error) {
      console.error('خطأ في الانضمام إلى الغرفة:', error);
      callback({ error: 'حدث خطأ أثناء الانضمام إلى الغرفة' });
    }
  };
}

/**
 * معالج مغادرة الغرفة
 */
function handleLeaveRoom(socket, io) {
  return (data, callback) => {
    try {
      const { roomId } = data;
      const playerId = data.playerId || socket.id;
      
      // التحقق من وجود الغرفة
      if (!rooms[roomId]) {
        return callback({ error: 'الغرفة غير موجودة' });
      }
      
      // التحقق من وجود اللاعب في الغرفة
      const playerIndex = rooms[roomId].players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) {
        return callback({ error: 'اللاعب ليس في الغرفة' });
      }
      
      // التحقق مما إذا كان اللاعب هو المضيف
      const isHost = rooms[roomId].players[playerIndex].isHost;
      
      // إزالة اللاعب من الغرفة
      rooms[roomId].players.splice(playerIndex, 1);
      
      // إزالة اللاعب من الفريق
      const playerTeam = rooms[roomId].players[playerIndex]?.team;
      if (playerTeam) {
        const teamIndex = rooms[roomId].teams[playerTeam].findIndex(p => p === playerId);
        if (teamIndex !== -1) {
          rooms[roomId].teams[playerTeam].splice(teamIndex, 1);
        }
      }
      
      // تحديث بيانات اللاعب
      if (players[playerId]) {
        players[playerId].room = null;
        players[playerId].team = null;
      }
      
      // مغادرة غرفة Socket.IO
      socket.leave(roomId);
      
      console.log(`غادر اللاعب ${players[playerId]?.username || playerId} الغرفة ${rooms[roomId].name}`);
      
      // إذا كان اللاعب هو المضيف، قم بتعيين مضيف جديد أو إغلاق الغرفة
      if (isHost) {
        if (rooms[roomId].players.length > 0) {
          // تعيين أول لاعب كمضيف جديد
          const newHostIndex = 0;
          rooms[roomId].players[newHostIndex].isHost = true;
          rooms[roomId].hostId = rooms[roomId].players[newHostIndex].id;
          rooms[roomId].hostName = rooms[roomId].players[newHostIndex].username;
          
          // إعلام اللاعبين بتغيير المضيف
          io.to(roomId).emit('room:update', rooms[roomId]);
        } else {
          // إغلاق الغرفة إذا لم يتبق أي لاعبين
          delete rooms[roomId];
          
          // تحديث قائمة الغرف للجميع
          updateRoomsList(io);
          
          return callback({ success: true });
        }
      }
      
      // إعلام جميع اللاعبين في الغرفة بمغادرة اللاعب
      io.to(roomId).emit('player:left', playerId);
      
      // تحديث قائمة الغرف للجميع
      updateRoomsList(io);
      
      callback({ success: true });
    } catch (error) {
      console.error('خطأ في مغادرة الغرفة:', error);
      callback({ error: 'حدث خطأ أثناء مغادرة الغرفة' });
    }
  };
}

/**
 * معالج توزيع اللاعبين على الفرق
 */
function handleAssignTeams(socket, io) {
  return (data, callback) => {
    try {
      const { roomId, assignments } = data;
      
      // التحقق من وجود الغرفة
      if (!rooms[roomId]) {
        return callback({ error: 'الغرفة غير موجودة' });
      }
      
      // التحقق من أن المرسل هو المضيف
      if (rooms[roomId].hostId !== socket.id) {
        return callback({ error: 'فقط المضيف يمكنه توزيع الفرق' });
      }
      
      // إعادة تعيين الفرق
      rooms[roomId].teams = {
        team1: [],
        team2: []
      };
      
      // توزيع اللاعبين على الفرق
      for (const [playerId, team] of Object.entries(assignments)) {
        // التحقق من وجود اللاعب في الغرفة
        const playerIndex = rooms[roomId].players.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
          // تحديث فريق اللاعب
          rooms[roomId].players[playerIndex].team = team;
          
          // إضافة اللاعب إلى الفريق
          if (team && rooms[roomId].teams[team]) {
            rooms[roomId].teams[team].push(playerId);
          }
          
          // تحديث بيانات اللاعب
          if (players[playerId]) {
            players[playerId].team = team;
          }
        }
      }
      
      console.log(`تم توزيع الفرق في الغرفة ${rooms[roomId].name}`);
      
      // إعلام جميع اللاعبين في الغرفة بتوزيع الفرق
      io.to(roomId).emit('room:update', rooms[roomId]);
      
      callback({ 
        success: true, 
        players: rooms[roomId].players,
        teams: rooms[roomId].teams
      });
    } catch (error) {
      console.error('خطأ في توزيع الفرق:', error);
      callback({ error: 'حدث خطأ أثناء توزيع الفرق' });
    }
  };
}

/**
 * معالج توزيع اللاعبين على الفرق بشكل عشوائي
 */
function handleRandomTeams(socket, io) {
  return (data, callback) => {
    try {
      const { roomId } = data;
      
      // التحقق من وجود الغرفة
      if (!rooms[roomId]) {
        return callback({ error: 'الغرفة غير موجودة' });
      }
      
      // التحقق من أن المرسل هو المضيف
      if (rooms[roomId].hostId !== socket.id) {
        return callback({ error: 'فقط المضيف يمكنه توزيع الفرق' });
      }
      
      // إعادة تعيين الفرق
      rooms[roomId].teams = {
        team1: [],
        team2: []
      };
      
      // الحصول على قائمة اللاعبين (باستثناء المضيف)
      const playerIds = rooms[roomId].players
        .filter(p => !p.isHost)
        .map(p => p.id);
      
      // خلط قائمة اللاعبين
      for (let i = playerIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playerIds[i], playerIds[j]] = [playerIds[j], playerIds[i]];
      }
      
      // توزيع اللاعبين على الفرق بالتناوب
      playerIds.forEach((playerId, index) => {
        const team = index % 2 === 0 ? 'team1' : 'team2';
        
        // التحقق من وجود اللاعب في الغرفة
        const playerIndex = rooms[roomId].players.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
          // تحديث فريق اللاعب
          rooms[roomId].players[playerIndex].team = team;
          
          // إضافة اللاعب إلى الفريق
          rooms[roomId].teams[team].push(playerId);
          
          // تحديث بيانات اللاعب
          if (players[playerId]) {
            players[playerId].team = team;
          }
        }
      });
      
      console.log(`تم توزيع الفرق عشوائياً في الغرفة ${rooms[roomId].name}`);
      
      // إعلام جميع اللاعبين في الغرفة بتوزيع الفرق
      io.to(roomId).emit('room:update', rooms[roomId]);
      
      callback({ 
        success: true, 
        players: rooms[roomId].players,
        teams: rooms[roomId].teams
      });
    } catch (error) {
      console.error('خطأ في التوزيع العشوائي للفرق:', error);
      callback({ error: 'حدث خطأ أثناء التوزيع العشوائي للفرق' });
    }
  };
}

/**
 * معالج بدء اللعبة
 */
function handleStartGame(socket, io) {
  return (data, callback) => {
    try {
      const { roomId } = data;
      
      // التحقق من وجود الغرفة
      if (!rooms[roomId]) {
        return callback({ error: 'الغرفة غير موجودة' });
      }
      
      // التحقق من أن المرسل هو المضيف
      if (rooms[roomId].hostId !== socket.id) {
        return callback({ error: 'فقط المضيف يمكنه بدء اللعبة' });
      }
      
      // التحقق من وجود لاعبين في كلا الفريقين
      if (rooms[roomId].teams.team1.length === 0 || rooms[roomId].teams.team2.length === 0) {
        return callback({ error: 'يجب أن يكون هناك لاعب واحد على الأقل في كل فريق' });
      }
      
      // تحديث حالة اللعبة
      rooms[roomId].gameState = {
        status: 'playing',
        currentQuestion: null,
        currentPlayer: null,
        hexGrid: generateHexGrid(
          config.game.hexGridSize.rows,
          config.game.hexGridSize.cols,
          config.game.arabicLetters
        ),
        scores: {
          team1: 0,
          team2: 0
        },
        startedAt: new Date().toISOString()
      };
      
      console.log(`تم بدء اللعبة في الغرفة ${rooms[roomId].name}`);
      
      // إعلام جميع اللاعبين في الغرفة ببدء اللعبة
      io.to(roomId).emit('game:state', rooms[roomId].gameState);
      
      // تحديث قائمة الغرف للجميع
      updateRoomsList(io);
      
      callback({ 
        success: true, 
        gameState: rooms[roomId].gameState
      });
    } catch (error) {
      console.error('خطأ في بدء اللعبة:', error);
      callback({ error: 'حدث خطأ أثناء بدء اللعبة' });
    }
  };
}

/**
 * معالج إعادة ترتيب الحروف
 */
function handleShuffleGame(socket, io) {
  return (data, callback) => {
    try {
      const { roomId } = data;
      
      // التحقق من وجود الغرفة
      if (!rooms[roomId]) {
        return callback({ error: 'الغرفة غير موجودة' });
      }
      
      // التحقق من حالة اللعبة
      if (rooms[roomId].gameState.status !== 'playing') {
        return callback({ error: 'اللعبة ليست قيد التقدم' });
      }
      
      // إعادة ترتيب الحروف
      rooms[roomId].g
(Content truncated due to size limit. Use line ranges to read in chunks)
