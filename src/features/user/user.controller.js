import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 13);
      const userID = req.userID;
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is Updated");
    } catch (err) {
      next(err)
    }

  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new user model
      // const user = new UserModel(name, email, hashedPassword, type);

      // Save the user to the repository
      const user = await this.userRepository.signUp(name, email, hashedPassword, type);

      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(email)

      // Fetch user by email from the repository
      const result = await this.userRepository.signIn(email);
      console.log(result)

      if (!result) {
        console.log(result)
        return res.status(400).send('Incorrect Credentials');
      }

      // Compare the provided password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, result.password);

      if (!isPasswordCorrect) {
        return res.status(400).send('Incorrect Credentials');
      }

      // Create token
      const token = jwt.sign(
        {
          userID: result._id,
          email: result.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send token
      return res.status(200).send(token);
    } catch (err) {
      next(err);
    }
  }
}
