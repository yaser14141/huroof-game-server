// controllers/authController.js
// وحدة التحكم في المصادقة

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// إنشاء رمز JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.security.sessionSecret, {
    expiresIn: config.security.tokenExpiration
  });
};

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ 
      $or: [
        { username },
        { email: email || null }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل' 
      });
    }
    
    // إنشاء مستخدم جديد
    const user = new User({
      username,
      email,
      password,
      status: 'online',
      lastLogin: new Date()
    });
    
    await user.save();
    
    // إنشاء رمز JWT
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        points: user.points,
        settings: user.settings,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('خطأ في تسجيل المستخدم:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء تسجيل المستخدم' });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // البحث عن المستخدم
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
    
    // التحقق من كلمة المرور
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
    
    // تحديث حالة المستخدم ووقت آخر تسجيل دخول
    user.status = 'online';
    user.lastLogin = new Date();
    await user.save();
    
    // إنشاء رمز JWT
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        points: user.points,
        settings: user.settings,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء تسجيل الدخول' });
  }
};

// الحصول على بيانات المستخدم الحالي
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب بيانات المستخدم' });
  }
};

// تحديث بيانات المستخدم
exports.updateUser = async (req, res) => {
  try {
    const { email, avatar, settings } = req.body;
    
    // البحث عن المستخدم وتحديثه
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }
    
    // تحديث البيانات
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (settings) {
      user.settings = {
        ...user.settings,
        ...settings
      };
    }
    
    await user.save();
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        points: user.points,
        settings: user.settings,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('خطأ في تحديث بيانات المستخدم:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحديث بيانات المستخدم' });
  }
};

// تغيير كلمة المرور
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // البحث عن المستخدم
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }
    
    // التحقق من كلمة المرور الحالية
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'كلمة المرور الحالية غير صحيحة' });
    }
    
    // تحديث كلمة المرور
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تغيير كلمة المرور:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء تغيير كلمة المرور' });
  }
};

// تسجيل الخروج
exports.logout = async (req, res) => {
  try {
    // تحديث حالة المستخدم
    const user = await User.findById(req.user.id);
    
    if (user) {
      user.status = 'offline';
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء تسجيل الخروج' });
  }
};
