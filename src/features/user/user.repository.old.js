import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../Error Handler/applicationError.js";
import bcrypt from 'bcrypt';

export default class UserRepository {
    constructor() {
        this.collection = "users";
    }

    async signUp(newUser) {
        try {
            // 1. Get the database.
            const db = getDB();
            // 2. Get the collection.
            const collection = db.collection(this.collection);
            // 3. Insert the document.
            await collection.insertOne(newUser);
            return newUser;
        } catch (err) {
            console.error('Error during user signup:', err.message, err.stack); // Log error details
            throw new ApplicationError('SignUp Failed', 500, err);
        }
    }

    async signIn(email) {
        try {
            // 1. Get the database.
            console.log(`email:-${email}`)
            const db = getDB();
            // 2. Get the collection.
            const collection = db.collection(this.collection);
            // 3. Find the user by email.
            const user = await collection.findOne( {email} );
            console.log(`user:-${user}`)
            console.log(`user:-${email}`)

            if (!user) {
                return null; // User not found
            }

            return user; // Return user document to be used for password comparison
        } catch (err) {
            console.error('Error during user sign-in:', err.message, err.stack);
            throw new ApplicationError('SignIn Failed', 500, err);
        }
    }
}
