// middlewares/firebaseAuth.js
const admin = require('firebase-admin');

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Contains uid, email, etc.
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
  }
};

module.exports = verifyFirebaseToken;
