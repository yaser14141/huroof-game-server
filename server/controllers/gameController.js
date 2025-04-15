// controllers/gameController.js
// وحدة التحكم في اللعبة

const Game = require('../models/Game');
const Room = require('../models/Room');
const User = require('../models/User');
const Question = require('../models/Question');
const { generateHexGrid } = require('../utils/gameHelpers');

// بدء لعبة جديدة
exports.startGame = async (req, res) => {
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
    
    // التحقق مما إذا كان المستخدم هو المضيف
    const isHost = room.host.toString() === user._id.toString();
    
    if (!isHost) {
      return res.status(403).json({ success: false, error: 'يجب أن تكون المضيف لبدء اللعبة' });
    }
    
    // التحقق من وجود لاعبين كافيين
    if (room.players.length < 2) {
      return res.status(400).json({ success: false, error: 'يجب أن يكون هناك لاعبان على الأقل لبدء اللعبة' });
    }
    
    // التحقق من توزيع اللاعبين على الفرق
    const team1Count = room.teams.team1.length;
    const team2Count = room.teams.team2.length;
    
    if (team1Count === 0 || team2Count === 0) {
      return res.status(400).json({ success: false, error: 'يجب أن يكون هناك لاعب واحد على الأقل في كل فريق' });
    }
    
    // إنشاء شبكة اللعبة
    const hexGrid = generateHexGrid();
    
    // تحديث حالة الغرفة
    room.gameState.status = 'playing';
    room.gameState.hexGrid = hexGrid;
    room.gameState.startedAt = new Date();
    
    await room.save();
    
    // إنشاء لعبة جديدة
    const game = new Game({
      room: room._id,
      players: room.players.map(player => ({
        user: player.user,
        team: player.team,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0
      })),
      hexGrid,
      scores: {
        team1: 0,
        team2: 0
      },
      status: 'playing',
      startedAt: new Date()
    });
    
    await game.save();
    
    res.json({
      success: true,
      game: {
        id: game._id,
        room: game.room,
        players: game.players,
        hexGrid: game.hexGrid,
        scores: game.scores,
        status: game.status,
        startedAt: game.startedAt
      }
    });
  } catch (error) {
    console.error('خطأ في بدء اللعبة:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء بدء اللعبة' });
  }
};

// الحصول على سؤال عشوائي
exports.getRandomQuestion = async (req, res) => {
  try {
    const { letter, difficulty } = req.query;
    
    // بناء استعلام البحث
    const query = { isApproved: true };
    
    if (letter) {
      query.letter = letter;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // البحث عن الأسئلة المناسبة
    const count = await Question.countDocuments(query);
    
    if (count === 0) {
      return res.status(404).json({ success: false, error: 'لا توجد أسئلة متاحة' });
    }
    
    // اختيار سؤال عشوائي
    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne(query).skip(random);
    
    // تحديث عدد استخدام السؤال
    question.usageCount += 1;
    await question.save();
    
    res.json({
      success: true,
      question: {
        id: question._id,
        text: question.text,
        letter: question.letter,
        answers: question.answers,
        difficulty: question.difficulty,
        category: question.category,
        timeLimit: question.timeLimit,
        points: question.points,
        hint: question.hint
      }
    });
  } catch (error) {
    console.error('خطأ في جلب سؤال عشوائي:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب سؤال عشوائي' });
  }
};

// تقديم إجابة
exports.submitAnswer = async (req, res) => {
  try {
    const { gameId, questionId } = req.params;
    const { answer, answerTime } = req.body;
    
    // التحقق من وجود المستخدم
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }
    
    // البحث عن اللعبة
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ success: false, error: 'اللعبة غير موجودة' });
    }
    
    // التحقق من حالة اللعبة
    if (game.status !== 'playing') {
      return res.status(400).json({ success: false, error: 'اللعبة ليست قيد التقدم' });
    }
    
    // التحقق من وجود اللاعب في اللعبة
    const playerIndex = game.players.findIndex(player => player.user.toString() === user._id.toString());
    
    if (playerIndex === -1) {
      return res.status(400).json({ success: false, error: 'أنت لست لاعباً في هذه اللعبة' });
    }
    
    // البحث عن السؤال
    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ success: false, error: 'السؤال غير موجود' });
    }
    
    // التحقق من الإجابة
    const isCorrect = question.answers.some(a => a.text.trim().toLowerCase() === answer.trim().toLowerCase() && a.isCorrect);
    
    // تحديث إحصائيات اللاعب
    const player = game.players[playerIndex];
    
    if (isCorrect) {
      player.score += question.points;
      player.correctAnswers += 1;
      
      // تحديث نقاط الفريق
      game.scores[player.team] += question.points;
      
      // تحديث إحصائيات السؤال
      question.correctAnswerCount += 1;
      await question.save();
      
      // تحديث إحصائيات المستخدم
      user.statistics.correctAnswers += 1;
      user.statistics.totalAnswers += 1;
      user.points += question.points;
      await user.save();
    } else {
      player.wrongAnswers += 1;
      
      // تحديث إحصائيات المستخدم
      user.statistics.totalAnswers += 1;
      await user.save();
    }
    
    // إضافة الإجابة إلى الجولة الحالية
    const currentRound = game.rounds[game.rounds.length - 1];
    
    if (currentRound && currentRound.question.toString() === questionId) {
      currentRound.answers.push({
        player: user._id,
        answer,
        isCorrect,
        answerTime,
        answeredAt: new Date()
      });
      
      // تحديث الفائز بالجولة إذا كانت الإجابة صحيحة
      if (isCorrect && !currentRound.winner) {
        currentRound.winner = user._id;
        currentRound.winningTeam = player.team;
        currentRound.endedAt = new Date();
      }
    } else {
      // إنشاء جولة جديدة إذا لم تكن موجودة
      game.rounds.push({
        number: game.rounds.length + 1,
        question: questionId,
        answers: [{
          player: user._id,
          answer,
          isCorrect,
          answerTime,
          answeredAt: new Date()
        }],
        winner: isCorrect ? user._id : null,
        winningTeam: isCorrect ? player.team : null,
        startedAt: new Date(),
        endedAt: isCorrect ? new Date() : null
      });
    }
    
    await game.save();
    
    res.json({
      success: true,
      answer: {
        player: {
          id: user._id,
          username: user.username
        },
        question: questionId,
        answer,
        isCorrect,
        answerTime,
        points: isCorrect ? question.points : 0
      },
      scores: game.scores
    });
  } catch (error) {
    console.error('خطأ في تقديم الإجابة:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء تقديم الإجابة' });
  }
};

// احتلال خلية
exports.captureCell = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { cellId, team } = req.body;
    
    // التحقق من وجود المستخدم
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }
    
    // البحث عن اللعبة
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ success: false, error: 'اللعبة غير موجودة' });
    }
    
    // التحقق من حالة اللعبة
    if (game.status !== 'playing') {
      return res.status(400).json({ success: false, error: 'اللعبة ليست قيد التقدم' });
    }
    
    // التحقق من وجود اللاعب في اللعبة
    const playerIndex = game.players.findIndex(player => player.user.toString() === user._id.toString());
    
    if (playerIndex === -1) {
      return res.status(400).json({ success: false, error: 'أنت لست لاعباً في هذه اللعبة' });
    }
    
    // التحقق من الفريق
    const player = game.players[playerIndex];
    
    if (player.team !== team) {
      return res.status(400).json({ success: false, error: 'لا يمكنك احتلال خلية لفريق آخر' });
    }
    
    // التحقق من وجود الخلية
    if (!game.hexGrid[cellId]) {
      return res.status(404).json({ success: false, error: 'الخلية غير موجودة' });
    }
    
    // التحقق مما إذا كانت الخلية محتلة بالفعل
    if (game.hexGrid[cellId].team) {
      return res.status(400).json({ success: false, error: 'الخلية محتلة بالفعل' });
    }
    
    // احتلال الخلية
    game.hexGrid[cellId] = {
      ...game.hexGrid[cellId],
      team,
      capturedBy: user._id,
      capturedAt: new Date()
    };
    
    // التحقق من الفوز
    let winner = null;
    let gameEnded = false;
    
    // حساب عدد الخلايا المحتلة لكل فريق
    const team1Cells = Object.values(game.hexGrid).filter(cell => cell.team === 'team1').length;
    const team2Cells = Object.values(game.hexGrid).filter(cell => cell.team === 'team2').length;
    const totalCells = Object.keys(game.hexGrid).length;
    
    // التحقق من شروط الفوز
    if (team1Cells > totalCells / 2) {
      winner = 'team1';
      gameEnded = true;
    } else if (team2Cells > totalCells / 2) {
      winner = 'team2';
      gameEnded = true;
    } else if (team1Cells + team2Cells === totalCells) {
      // إذا تم احتلال جميع الخلايا، الفريق صاحب الخلايا الأكثر هو الفائز
      winner = team1Cells > team2Cells ? 'team1' : 'team2';
      gameEnded = true;
    }
    
    // إنهاء اللعبة إذا تم تحقيق شروط الفوز
    if (gameEnded) {
      game.winner = winner;
      game.status = 'finished';
      game.endedAt = new Date();
      
      // تحديث إحصائيات اللاعبين
      for (const player of game.players) {
        const playerUser = await User.findById(player.user);
        
        if (playerUser) {
          playerUser.statistics.gamesPlayed += 1;
          
          if (player.team === winner) {
            playerUser.statistics.gamesWon += 1;
            playerUser.points += 50; // مكافأة الفوز
          }
          
          await playerUser.save();
        }
      }
      
      // تحديث حالة الغرفة
      const room = await Room.findById(game.room);
      
      if (room) {
        room.gameState.status = 'finished';
        room.gameState.endedAt = new Date();
        await room.save();
      }
    }
    
    await game.save();
    
    res.json({
      success: true,
      cell: {
        id: cellId,
        team,
        capturedBy: user._id,
        capturedAt: new Date()
      },
      hexGrid: game.hexGrid,
      winner,
      gameEnded
    });
  } catch (error) {
    console.error('خطأ في احتلال الخلية:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء احتلال الخلية' });
  }
};

// إنهاء اللعبة
exports.endGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // التحقق من وجود المستخدم
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }
    
    // البحث عن اللعبة
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ success: false, error: 'اللعبة غير موجودة' });
    }
    
    // التحقق من حالة اللعبة
    if (game.status !== 'playing') {
      return res.status(400).json({ success: false, error: 'اللعبة ليست قيد التقدم' });
    }
    
    // البحث عن الغرفة
    const room = await Room.findById(game.room);
    
    if (!room) {
      return res.status(404).json({ success: false, error: 'الغرفة غير موجودة' });
    }
    
    // التحقق مما إذا كان المستخدم هو المضيف
    const isHost = room.host.toString() === user._id.toString();
    
    if (!isHost) {
      return res.status(403).json({ success: false, error: 'يجب أن تكون المضيف لإنهاء اللعبة' });
    }
    
    // تحديد الفائز بناءً على النقاط
    let winner = null;
    
    if (game.scores.team1 > game.scores.team2) {
      winner = 'team1';
    } else if (game.scores.team2 > game.scores.team1) {
      winner = 'team2';
    } else {
      // في حالة التعادل، الفريق صاحب الخلايا الأكثر هو الفائز
      const team1Cells = Object.values(game.hexGrid).filter(cell => cell.team === 'team1').length;
      const team2Cells = Object.values(game.hexGrid).filter(cell => cell.team === 'team2').length;
      
      winner = team1Cells >= team2Cells ? 'team1' : 'team2';
    }
    
    // إنهاء اللعبة
    game.winner = winner;
    game.status = 'finished';
    game.endedAt = new Date();
    
    // تحديث إحصائيات اللاعبين
    for (const player of game.players) {
      const playerUser = await User.findById(player.user);
      
      if (playerUser) {
        playerUser.statistics.gamesPlayed += 1;
        
        if (player.team === winner) {
          playerUser.statistics.gamesWon += 1;
          playerUser.points += 50; // مكافأة الفوز
        }
        
        await playerUser.save();
      }
    }
    
    // تحديث حالة الغرفة
    room.gameState.status = 'finished';
    room.gameState.endedAt = new Date();
    
    await game.save();
    await room.save();
    
    res.json({
      success: true,
      game: {
        id: game._id,
        winner,
        scores: game.scores,
        status: game.status,
        endedAt: game.endedAt
      }
    });
  } catch (error) {
    console.error('خطأ في إنهاء اللعبة:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء إنهاء اللعبة' });
  }
};

// الحصول على تفاصيل اللعبة
exports.getGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // البحث عن اللعبة
    const game = await Game.findById(gameId)
      .populate('room', 'name')
      .populate('players.user', 'username avatar')
      .populate({
        path: 'rounds.question',
        select: 'text letter answers difficulty category timeLimit points'
      })
      .populate('rounds.winner', 'username')
      .populate('rounds.answers.player', 'username');
    
    if (!game) {
      return res.status(404).json({ success: false, error: 'اللعبة غير موجودة' });
    }
    
    res.json({
      success: true,
      game
    });
  } catch (error) {
    console.error('خطأ في جلب تفاصيل اللعبة:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب تفاصيل اللعبة' });
  }
};
