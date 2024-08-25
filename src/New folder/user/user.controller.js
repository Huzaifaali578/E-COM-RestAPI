import { ApplicationError } from '../../Error Handler/applicationError.js';
import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';

export default class UserController {
  async signUp(req, res) {
    try {
      const { name, email, password, type } = req.body;
      const user = await UserModel.signUp(name, email, password, type);
      res.status(201).send(user);
    } catch (err) {
      console.error('Error in signUp:', err); // Log the original error
      throw new ApplicationError('SignUp Failed', 500, err); // Include original error
    }
  }

  signIn(req, res) {
    const result = UserModel.signIn(req.body.email, req.body.password);
    if (!result) {
      return res.status(400).send('Incorrect Credentials');
    } else {
      const secretKey = 'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz';
      const token = jwt.sign(
        {
          userID: result.id,
          email: result.email,
        },
        secretKey,
        {
          expiresIn: '1h',
        }
      );

      return res.status(200).send(token);
    }
  }
}
