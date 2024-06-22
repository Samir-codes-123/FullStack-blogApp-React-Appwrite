import config from "../config/config.js";
import { Client, Databases, Query, ID, Storage } from "appwrite";

export class Service {
  client = new Client();
  databases;
  buckets; // storage

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectID);
    this.databases = new Databases(this.client);
    this.buckets = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      await this.databases.createDocument(
        config.appwriteDatabaseID, // db id
        config.appwriteCollectionID, // collection id
        slug, //document id
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        },
      );
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    // taking doc id first and not taking userid so only author can update
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseID, // db id
        config.appwriteCollectionID, // collection id
        slug, //document id
        {
          title,
          content,
          featuredImage,
          status,
        },
      );
    } catch (error) {
      console.log("Appwrite service:: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        config.appwriteDatabaseID, // db id
        config.appwriteCollectionID, // collection id
        slug, //document id
      );
      return true; //delete completed
    } catch (error) {
      console.log("Appwrite service:: deletePost :: error", error);
      return false; // not completed
    }
  }
  async getPost(slug) {
    // single post of user
    try {
      return await this.databases.getDocument(
        config.appwriteDatabaseID, // db id
        config.appwriteCollectionID, // collection id
        slug,
      );
    } catch (error) {
      console.log("Appwrite service:: getPost :: error", error);
      return false;
    }
  }
  async getPosts(queries = [Query.equal("status", "active")]) {
    // status is the index created in db
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseID, // db id
        config.appwriteCollectionID, // collection id
        queries,
      );
    } catch (error) {
      console.log("Appwrite service:: getPosts :: error", error);
      return false;
    }
  }

  //file upload service
  async uploadFile(file) {
    // should include all the content of the file
    try {
      await this.buckets.createFile(config.appwriteBucketID, ID.unique(), file);
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
    }
  }

  async deleteFile(fileId) {
    try {
      await this.buckets.deleteFile(config.appwriteBucketID, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.buckets.getFilePreview(config.appwriteBucketID, fileId);
  }
}

const service = new Service();
export default service;
