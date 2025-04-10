const admin = require('firebase-admin');

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('🛂 Incoming request to protected route');
  console.log('🔍 Authorization Header:', authHeader || 'None');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⚠️ No Bearer token found in Authorization header');
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    console.log('🔐 Verifying Firebase token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('✅ Token verified! UID:', decodedToken.uid);

    req.user = decodedToken; // uid, email, etc.
    next();
  } catch (err) {
    console.error('❌ Firebase token verification failed');
    console.error('🧾 Error details:', err);

    return res.status(403).json({
      success: false,
      message: 'Forbidden: Invalid token',
      error: err.message,
    });
  }
};

module.exports = verifyFirebaseToken;
