// controllers/roomController.js
// وحدة التحكم في الغرف

const Room = require('../models/Room');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// إنشاء غرفة جديدة
exports.createRoom = async (req, res) => {
  try {
    const { name, type, maxPlayers, answerTime, penaltyTime, teamColors } = req.body;
    
    // التحقق من وجود المستخدم
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }
    
    // إنشاء كود للغرفة إذا كانت من نوع "code"
    let code = null;
    if (type === 'code') {
      code = Math.floor(100000 + Math.random() * 900000).toString(); // كود من 6 أرقام
    }
    
    // إنشاء غرفة جديدة
    const room = new Room({
      name,
      type: type || 'public',
      code,
      host: user._id,
      maxPlayers: maxPlayers || 8,
      answerTime: answerTime || 30,
      penaltyTime: penaltyTime || 10,
      teamColors: teamColors || { team1: '#FF5555', team2: '#5555FF' },
      players: [{
        user: user._id,
        team: null,
        isHost: true,
        joinedAt: new Date()
      }],
      teams: {
        team1: [],
        team2: []
      },
      gameState: {
        status: 'waiting',
        currentQuestion: null,
        currentPlayer: null,
        hexGrid: {},
        scores: {
          team1: 0,
          team2: 0
        },
        startedAt: null,
        endedAt: null
      }
    });
    
    await room.save();
    
    // تحديث حالة المستخدم
    user.status = 'playing';
    await user.save();
    
    res.status(201).json({
      success: true,
      room: {
        id: room._id,
        name: room.name,
        type: room.type,
        code: room.code,
        host: {
          id: user._id,
          username: user.username
        },
        maxPlayers: room.maxPlayers,
        answerTime: room.answerTime,
        penaltyTime: room.penaltyTime,
        teamColors: room.teamColors,
        players: [{
          id: user._id,
          username: user.username,
          team: null,
          isHost: true
        }],
        gameState: {
          status: room.gameState.status
        },
        createdAt: room.createdAt
      }
    });
  } catch (error) {
    console.error('خطأ في إنشاء الغرفة:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء إنشاء الغرفة' });
  }
};

// الحصول على قائمة الغرف العامة
exports.getRooms = async (req, res) => {
  try {
    // البحث عن الغرف العامة
    const rooms = await Room.find({ type: 'public', 'gameState.status': 'waiting' })
      .populate('host', 'username')
      .populate('players.user', 'username')
      .sort({ createdAt: -1 });
    
    // تحويل الغرف إلى التنسيق المطلوب
    const formattedRooms = rooms.map(room => ({
      id: room._id,
      name: room.name,
      type: room.type,
      host: {
        id: room.host._id,
        username: room.host.username
      },
      maxPlayers: room.maxPlayers,
      players: room.players.length,
      gameState: {
        status: room.gameState.status
      },
      createdAt: room.createdAt
    }));
    
    res.json({
      success: true,
      rooms: formattedRooms
    });
  } catch (error) {
    console.error('خطأ في جلب قائمة الغرف:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب قائمة الغرف' });
  }
};

// الحصول على غرفة محددة
exports.getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // البحث عن الغرفة
    const room = await Room.findById(roomId)
      .populate('host', 'username')
      .populate('players.user', 'username avatar')
      .populate('gameState.currentQuestion')
      .populate('gameState.currentPlayer', 'username');
    
    if (!room) {
      return res.status(404).json({ success: false, error: 'الغرفة غير موجودة' });
    }
    
    // تحويل الغرفة إلى التنسيق المطلوب
    const formattedRoom = {
      id: room._id,
      name: room.name,
      type: room.type,
      code: room.code,
      host: {
        id: room.host._id,
        username: room.host.username
      },
      maxPlayers: room.maxPlayers,
      answerTime: room.answerTime,
      penaltyTime: room.penaltyTime,
      teamColors: room.teamColors,
      players: room.players.map(player => ({
        id: player.user._id,
        username: player.user.username,
        avatar: player.user.avatar,
        team: player.team,
        isHost: player.isHost,
        joinedAt: player.joinedAt
      })),
      teams: room.teams,
      gameState: {
        status: room.gameState.status,
        currentQuestion: room.gameState.currentQuestion,
        currentPlayer: room.gameState.currentPlayer ? {
          id: room.gameState.currentPlayer._id,
          username: room.gameState.currentPlayer.username
        } : null,
        hexGrid: room.gameState.hexGrid,
        scores: room.gameState.scores,
        startedAt: room.gameState.startedAt,
        endedAt: room.gameState.endedAt
      },
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    };
    
    res.json({
      success: true,
      room: formattedRoom
    });
  } catch (error) {
    console.error('خطأ في جلب الغرفة:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب الغرفة' });
  }
};

// الانضمام إلى غرفة
exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // التحقق من وجود المستخدم
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }
    
    // البحث عن الغرفة
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ success: false, error: 'الغرفة غير موجودة' });
    }
    
    // التحقق من حالة اللعبة
    if (room.gameState.status !== 'waiting') {
      return res.status(400).json({ success: false, error: 'اللعبة قيد التقدم بالفعل' });
    }
    
    // التحقق من عدد اللاعبين
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ success: false, error: 'الغرفة ممتلئة' });
    }
    
    // التحقق مما إذا كان المستخدم في الغرفة بالفعل
    const existingPlayer = room.players.find(player => player.user.toString() === user._id.toString());
    
    if (existingPlayer) {
      return res.status(400).json({ success: false, error: 'أنت في الغرفة بالفعل' });
    }
    
    // إضافة المستخدم إلى الغرفة
    room.players.push({
      user: user._id,
      team: null,
      isHost: false,
      joinedAt: new Date()
    });
    
    await room.save();
    
    // تحديث حالة المستخدم
    user.status = 'playing';
    await user.save();
    
    // جلب الغرفة المحدثة مع بيانات المستخدمين
    const updatedRoom = await Room.findById(roomId)
      .populate('host', 'username')
      .populate('players.user', 'username avatar');
    
    // تحويل الغرفة إلى التنسيق المطلوب
    const formattedRoom = {
      id: updatedRoom._id,
      name: updatedRoom.name,
      type: updatedRoom.type,
      code: updatedRoom.code,
      host: {
        id: updatedRoom.host._id,
        username: updatedRoom.host.username
      },
      maxPlayers: updatedRoom.maxPlayers,
      answerTime: updatedRoom.answerTime,
      penaltyTime: updatedRoom.penaltyTime,
      teamColors: updatedRoom.teamColors,
      players: updatedRoom.players.map(player => ({
        id: player.user._id,
        username: player.user.username,
        avatar: player.user.avatar,
        team: player.team,
        isHost: player.isHost,
        joinedAt: player.joinedAt
      })),
      teams: updatedRoom.teams,
      gameState: {
        status: updatedRoom.gameState.status
      },
      createdAt: updatedRoom.createdAt,
      updatedAt: updatedRoom.updatedAt
    };
    
    res.json({
      success: true,
      room: formattedRoom
    });
  } catch (error) {
    console.error('خطأ في الانضمام إلى الغرفة:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء الانضمام إلى الغرفة' });
  }
};

// مغادرة الغرفة
exports.leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // التحقق من وجود المستخدم
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }
    
    // البحث عن الغرفة
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ success: false, error: 'الغرفة غير موجودة' });
    }
    
    // التحقق مما إذا كان المستخدم في الغرفة
    const playerIndex = room.players.findIndex(player => player.user.toString() === user._id.toString());
    
    if (playerIndex === -1) {
      return res.status(400).json({ success: false, error: 'أنت لست في الغرفة' });
    }
    
    // التحقق مما إذا كان المستخدم هو المضيف
    const isHost = room.players[playerIndex].isHost;
    
    // إزالة المستخدم من الفريق
    const playerTeam = room.players[playerIndex].team;
    
    if (playerTeam) {
      const teamIndex = room.teams[playerTeam].findIndex(id => id.toString() === user._id.toString());
      
      if (teamIndex !== -1) {
        room.teams[playerTeam].splice(teamIndex, 1);
      }
    }
    
    // إزالة المستخدم من الغرفة
    room.players.splice(playerIndex, 1);
    
    // إذا كان المستخدم هو المضيف، قم بتعيين مضيف جديد أو إغلاق الغرفة
    if (isHost) {
      if (room.players.length > 0) {
        // تعيين أول لاعب كمضيف جديد
        room.players[0].isHost = true;
        room.host = room.players[0].user;
      } else {
        // إغلاق الغرفة إذا لم يتبق أي لاعبين
        await Room.findByIdAndDelete(roomId);
        
        // تحديث حالة المستخدم
        user.status = 'online';
        await user.save();
        
        return res.json({
          success: true,
          message: 'تم مغادرة الغرفة وإغلاقها بنجاح'
        });
      }
    }
    
    await room.save();
    
    // تحديث حالة المستخدم
    user.status = 'online';
    await user.save();
    
    res.json({
      success: true,
      message: 'تم مغادرة الغرفة بنجاح'
    });
  } catch (error) {
    console.error('خطأ في مغادرة الغرفة:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء مغادرة الغرفة' });
  }
};

// البحث عن غرفة بالكود
exports.findRoomByCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    // البحث عن الغرفة بالكود
    const room = await Room.findOne({ code, type: 'code' })
      .populate('host', 'username')
      .populate('players.user', 'username');
    
    if (!room) {
      return res.status(404).json({ success: false, error: 'الغرفة غير موجودة' });
    }
    
    // تحويل الغرفة إلى التنسيق المطلوب
    const formattedRoom = {
      id: room._id,
      name: room.name,
      type: room.type,
      code: room.code,
      host: {
        id: room.host._id,
        username: room.host.username
      },
      maxPlayers: room.maxPlayers,
      players: room.players.length,
      gameState: {
        status: room.gameState.status
      },
      createdAt: room.createdAt
    };
    
    res.json({
      success: true,
      room: formattedRoom
    });
  } catch (error) {
    console.error('خطأ في البحث عن الغرفة بالكود:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء البحث عن الغرفة بالكود' });
  }
};
