/* eslint-disable no-useless-catch */
import config from "../config/config.js";
import { Client, Account, ID } from "appwrite";
// class
export class Authservice {
  client = new Client(); // dont give value here wastage of class resources
  account;
  // change constructor according to services
  constructor() {
    // production level practice
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectID);
    this.account = new Account(this.client);
  }

  // to make our app free from appwrite dependency so we could use other services
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );
      if (userAccount) {
        // method calling for login here
        return this.login({ email, password }); // if account is created directly login should happen
      } else {
        return userAccount; // might be null or fail to create a user
      }
    } catch (error) {
      throw error;
    }
  }
  async login({ email, password }) {
    // login
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  // to get the current user status in homepage
  async getCurrentUser() {
    try {
      return await this.account.get(); // sends data
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser:: error", error);
    }
    return null; // if nothing comes then return null in try
  }

  async logout() {
    try {
      return await this.account.deleteSessions(); // there is deletesession method too
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}
//object
const authService = new Authservice(); // when made object then get info to client using constructor
export default authService;
