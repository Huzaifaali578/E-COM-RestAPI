import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../Error Handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }

  

  static async getAll() {
    try {
      const db = getDB();
      const collection = db.collection('users');
      const users = await collection.find({}).toArray();
      return users;
    } catch (err) {
      console.error('Error retrieving users:', err.message, err.stack);
      throw new ApplicationError('Failed to retrieve users', 500, err);
    }
  }
}
