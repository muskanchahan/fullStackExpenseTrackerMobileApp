const jwt=require('jsonwebtoken');
const {User}=require('../modul/index')
const authenticate = (req, res, next) => {
  try {
    // Correctly access the 'authorization' header
    const authHeader = req.headers['authorization']; 

    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Ensure the header is in the format 'Bearer <token>'
    const token = authHeader.split(' ')[1];

    // Verify the token using your secret key
    const decoded = jwt.verify(token, 'yourSecretKey');
    req.userId = decoded.id;  // Attach user ID to the request object

    User.findByPk(req.userId)
      .then(user => {
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;  // Attach user details to the request
        next();
      })
      .catch(error => {
        return res.status(500).json({ success: false, message: 'User lookup failed', error });
      });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};


module.exports= {authenticate};
