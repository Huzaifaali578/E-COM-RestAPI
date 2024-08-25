import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
  // 1. Read the token from the `Authorization` header
  const token = req.headers['authorization'];

  // 2. If no token, return an error
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  // 3. Verify the token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = payload.userID; // Assign the userID from the payload
    console.log(payload); // This should log the decoded payload
    console.log(req.userID); // This should log the userID, make sure it's correct
  } catch (err) {
    // 4. Return error if token verification fails
    console.log(err);
    return res.status(401).send('Unauthorized');
  }

  // 5. Call the next middleware
  next();
};

export default jwtAuth;
