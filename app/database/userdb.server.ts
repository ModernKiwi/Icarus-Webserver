import { prop, getModelForClass } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

// Account class for storing user account information
class Account {
  @prop({ required: true, default: false })
  public admin!: boolean;

  @prop({ default: Date.now })
  public registeredAt?: Date;
}

// User class for storing user information
export class User {
  @prop({ required: true, unique: true, lowercase: true })
  public username!: string;

  @prop({ required: true })
  public hashedPW?: string;

  @prop({ index: true, lowercase: true })
  public email?: string;

  @prop()
  public account?: Account;
}

// Create a Mongoose model for User
const UserModel = getModelForClass(User);

// UserService class for handling user-related operations
class UserService {
  // Check if a username exists in the database
  // @param {string} username - The username to check for existence
  static async checkUsernameExists(username: string) {
    return Boolean(await UserModel.findOne({ username }).select('_id'));
  }

  // Check if an email exists in the database
  // @param {string} email - The email to check for existence
  static async checkEmailExists(email: string) {
    return Boolean(await UserModel.findOne({ email }).select('_id'));
  }

  // Verify if the provided password matches the stored hashed password
  // @param {string} username - The username to verify the password for
  // @param {string} password - The password to verify
  static async verifyUserPassword(username: string, password: string) {
    const user = await UserModel.findOne({ username }).select('hashedPW');
    return user ? await bcrypt.compare(password, user.hashedPW!) : false;
  }

  // Create a new user with the given username, password, and optional email
  // @param {string} username - The username for the new user
  // @param {string} password - The password for the new user
  // @param {string} [email] - The optional email for the new user
  static async createUser(username: string, password: string, email?: string) {
    const hashedPW = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, email, hashedPW });

    return await user.save();
  }

  // Create a new admin user with the given username, password, and optional email
  // @param {string} username - The username for the new admin user
  // @param {string} password - The password for the new admin user
  // @param {string} [email] - The optional email for the new admin user
  static async createAdminUser(username: string, password: string, email?: string) {
    const hashedPW = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, email, hashedPW, account: { admin: true } });

    return await user.save();
  }

  // Get a user by their username without returning account or password information
  // @param {string} username - The username of the user to fetch
  static async getUser(username: string) {
    return await UserModel.findOne({ username }).select('-account -hashedPW');
  }

  // Get a user securely by their username and password, without returning the password
  // @param {string} username - The username of the user to fetch
  // @param {string} password - The password of the user to fetch
  static async getUserSecure(username: string, password: string) {
    const user = await UserModel.findOne({ username });
    if (user) {
      const passwordVerified = await bcrypt.compare(password, user.hashedPW!);
      if (passwordVerified) {
        const { hashedPW, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      }
    }
    return null;
  }

  // Delete a user by their ID
  // @param {string} userId - The ID of the user to delete
  static async deleteUserById(userId: string) {
    const result = await UserModel.deleteOne({ _id: userId });
    return result.deletedCount > 0;
  }
}

export default UserService;
