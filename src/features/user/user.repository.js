import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../Error Handler/applicationError.js";

const userModel = mongoose.model("users", userSchema);

export default class UserRepository {

    async resetPassword(userID, hashedPassword) {
        try {
            const user = await userModel.findById(userID);
            if (!user) {
                throw new Error("User not Found")
            };
            user.password = hashedPassword
            user.save();
        } catch (err) {
            console.log(err)
            throw new ApplicationError("Something went wrong password not changed")
        }
    }
    
    async signUp(user) {
        try {
            // Check if user with the same email already exists
            const existingUser = await userModel.findOne({ email: user.email });
            if (existingUser) {
                throw new ApplicationError('User already exists', 400);
            }

            // Create instance of model
            const newUser = new userModel(user);
            await newUser.save();
            return newUser;
        } catch (err) {
            console.error('Error during user signup:', err.message, err.stack);
            throw new ApplicationError('SignUp Failed', 500, err);
        }
    }

    async signIn(email) {
        try {
            // if (!email || !this.validateEmail(email)) {
            //     throw new ApplicationError('Invalid email format', 400);
            // }

            const user = await userModel.findOne({ email });
            if (!user) {
                throw new ApplicationError('User not found', 404);
            }

            return user;
        } catch (err) {
            console.error('Error during user sign-in:', err.message, err.stack);
            throw new ApplicationError('SignIn Failed', 500, err);
        }
    }

    // Helper method to validate email format
    // validateEmail(email) {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return emailRegex.test(email);
    // }
}
