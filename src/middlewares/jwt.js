import jwt from 'jsonwebtoken';

const WHITE_LIST = [
  '/api/auth',
];

export default (req, res, next) => {
  if (WHITE_LIST.includes(req.path)) {
    next();
  } else {
    const bearer = req.headers.authorization;
    const token = bearer && bearer.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        if (new Date().getTime() / 1000 > decoded.exp) {
          return res.status(403).json({ error: 'Token is expired' });
        }
        req.headers.user = decoded;
        next();
      });
    } else {
      return res.status(403).json({ error: 'No token provided' });
    }
  }
};
