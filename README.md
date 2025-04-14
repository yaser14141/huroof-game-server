# تعليمات تثبيت ونشر لعبة "حروف مع ياسر"

## نظرة عامة

هذا الملف يحتوي على تعليمات مفصلة لتثبيت ونشر لعبة "حروف مع ياسر" على منصة Render. المشروع يتكون من جزأين رئيسيين:

1. **ملفات العميل (Client)**: تحتوي على واجهة المستخدم المبنية باستخدام React
2. **ملفات الخادم (Server)**: تحتوي على الخادم المبني باستخدام Node.js وExpress وSocket.IO

## هيكل الملفات

```
huroof-game/
├── client/                  # ملفات العميل (للتطوير فقط)
│   ├── public/              # الملفات العامة
│   ├── src/                 # كود المصدر
│   └── package.json         # تبعيات العميل
│
└── server/                  # ملفات الخادم (للنشر على Render)
    ├── config.js            # إعدادات الخادم
    ├── package.json         # تبعيات الخادم
    ├── server.js            # الملف الرئيسي للخادم
    ├── public/              # الملفات العامة (نسخة مجمعة من العميل)
    ├── routes/              # مسارات API
    │   └── api.js           # مسارات API للتطبيق
    └── utils/               # وظائف مساعدة
        ├── gameHelpers.js   # وظائف مساعدة للعبة
        └── socketHandlers.js # معالجات الأحداث لـ Socket.IO
```

## خطوات النشر على Render

### 1. إعداد مستودع GitHub

1. قم بإنشاء مستودع GitHub جديد (أو استخدم مستودع موجود)
2. قم برفع مجلد `server` بالكامل إلى المستودع (هذا هو المجلد الذي سيتم نشره على Render)

### 2. إنشاء خدمة ويب جديدة على Render

1. قم بتسجيل الدخول إلى حسابك على [Render](https://render.com/)
2. انقر على "New" ثم اختر "Web Service"
3. اختر مستودع GitHub الذي قمت بإنشائه في الخطوة السابقة
4. قم بتعبئة المعلومات التالية:
   - **Name**: huroof-game (أو أي اسم تفضله)
   - **Region**: اختر المنطقة الأقرب إليك
   - **Branch**: main (أو الفرع الذي ترفع إليه الكود)
   - **Root Directory**: اتركه فارغاً إذا كان مجلد `server` في الجذر، أو أدخل `server` إذا كان في مجلد فرعي
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. انقر على "Advanced" وأضف المتغيرات البيئية التالية:
   - **PORT**: 10000
   - **NODE_ENV**: production
6. انقر على "Create Web Service"

### 3. انتظر اكتمال النشر

- سيبدأ Render في بناء ونشر التطبيق الخاص بك
- قد يستغرق هذا بضع دقائق
- يمكنك متابعة التقدم في علامة التبويب "Logs"

### 4. الوصول إلى التطبيق

- بمجرد اكتمال النشر، سيوفر Render رابطاً للوصول إلى التطبيق الخاص بك
- الرابط سيكون بتنسيق: `https://huroof-game.onrender.com` (أو ما يشبه ذلك بناءً على الاسم الذي اخترته)

## تحديث التطبيق

لتحديث التطبيق بعد إجراء تغييرات:

1. قم بتحديث الكود في مستودع GitHub
2. سيقوم Render تلقائياً ببناء ونشر الإصدار الجديد

## تطوير التطبيق محلياً

### إعداد الخادم

1. انتقل إلى مجلد `server`:
   ```
   cd server
   ```

2. قم بتثبيت التبعيات:
   ```
   npm install
   ```

3. قم بتشغيل الخادم في وضع التطوير:
   ```
   npm run dev
   ```

### إعداد العميل (للتطوير فقط)

1. انتقل إلى مجلد `client`:
   ```
   cd client
   ```

2. قم بتثبيت التبعيات:
   ```
   npm install
   ```

3. قم بتشغيل خادم التطوير:
   ```
   npm start
   ```

4. لبناء نسخة للإنتاج:
   ```
   npm run build
   ```

5. انسخ محتويات مجلد `build` إلى مجلد `server/public` قبل النشر.

## ملاحظات هامة

- تأكد من أن ملف `server.js` يستخدم المتغير البيئي `PORT` لتحديد المنفذ:
  ```javascript
  const PORT = process.env.PORT || 5000;
  ```

- تأكد من أن الخادم يستمع على جميع الواجهات:
  ```javascript
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
  });
  ```

- تأكد من وجود ملف `index.html` في مجلد `server/public`

## استكشاف الأخطاء وإصلاحها

إذا واجهت مشاكل في النشر، تحقق من:

1. **سجلات Render**: تحقق من علامة التبويب "Logs" في لوحة تحكم Render للحصول على تفاصيل الأخطاء
2. **ملف package.json**: تأكد من وجود جميع التبعيات المطلوبة
3. **مجلد public**: تأكد من وجود ملف `index.html` في مجلد `public`
4. **متغيرات البيئة**: تأكد من تعيين متغير `PORT` بشكل صحيح

## الدعم

إذا كنت بحاجة إلى مساعدة إضافية، يرجى التواصل مع فريق الدعم.
