import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../Error Handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this.id = id;
  }

  static async signUp(name, email, password, type) {
    try {
      // 1. Get the database.
      const db = getDB();
      // 2. Get the collections.
      const collection = db.collection('users');
      const newUser = new UserModel(name, email, password, type);
      // 3. Insert the document
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      console.error('Error in signUp:', err); // Log the original error
      throw new ApplicationError('SignUp Failed', 500, err);
    }
  }

  static async signIn(email, password) {
    try {
      // 1. Get the database.
      const db = getDB();
      // 2. Get the collections.
      const collection = db.collection('users');
      // 3. Find the user in the collection
      const user = await collection.findOne({ email, password });

      if (!user) {
        throw new ApplicationError('Invalid email or password', 400);
      }
      
      return user;
    } catch (err) {
      console.error('Error in signIn:', err);
      throw new ApplicationError('SignIn Failed', 500, err);
    }
  }

  static async getAll() {
    try {
      const db = getDB();
      const collection = db.collection('users');
      const users = await collection.find({}).toArray();
      return users;
    } catch (err) {
      console.error('Error in getAll:', err);
      throw new ApplicationError('Failed to retrieve users', 500, err);
    }
  }
}
