import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertPostSchema,
  insertConnectionSchema,
  insertMessageSchema,
  insertSubscriptionSchema,
  insertLikeSchema,
  insertCommentSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // All routes are already prefixed with /api in their definitions

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const newUser = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Error creating user" });
    }
  });
  
  app.get("/api/users/search", async (req, res) => {
    const query = req.query.q as string || "";
    const users = await storage.searchUsers(query);
    
    // Don't send passwords in response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return res.json(usersWithoutPasswords);
  });

  // Post routes
  app.get("/api/posts", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (!isNaN(userId)) {
      const posts = await storage.getUserPosts(userId);
      return res.json(posts);
    }
    
    return res.status(400).json({ message: "User ID required" });
  });
  
  app.get("/api/feed", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const posts = await storage.getFeedPosts(userId);
    
    // Get user info for each post
    const postsWithUserInfo = await Promise.all(posts.map(async (post) => {
      const user = await storage.getUser(post.userId);
      if (!user) return { ...post, user: null };
      
      const { password, ...userWithoutPassword } = user;
      
      // Get like count
      const likes = await storage.getPostLikes(post.id);
      const likedByUser = await storage.isPostLikedByUser(post.id, userId);
      
      // Get comment count
      const comments = await storage.getPostComments(post.id);
      
      return { 
        ...post, 
        user: userWithoutPassword,
        likeCount: likes.length,
        commentCount: comments.length,
        likedByUser
      };
    }));
    
    return res.json(postsWithUserInfo);
  });
  
  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(postData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const newPost = await storage.createPost(postData);
      return res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Error creating post" });
    }
  });

  // Connection routes
  app.post("/api/connections", async (req, res) => {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      
      // Check if users exist
      const follower = await storage.getUser(connectionData.followerId);
      if (!follower) {
        return res.status(404).json({ message: "Follower user not found" });
      }
      
      const following = await storage.getUser(connectionData.followingId);
      if (!following) {
        return res.status(404).json({ message: "Following user not found" });
      }
      
      // Check if connection already exists
      const connections = await storage.getUserConnections(connectionData.followerId);
      const existingConnection = connections.find(
        conn => conn.followingId === connectionData.followingId
      );
      
      if (existingConnection) {
        return res.status(400).json({ message: "Connection already exists" });
      }
      
      const newConnection = await storage.createConnection(connectionData);
      return res.status(201).json(newConnection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Error creating connection" });
    }
  });
  
  app.patch("/api/connections/:id", async (req, res) => {
    const connectionId = parseInt(req.params.id);
    if (isNaN(connectionId)) {
      return res.status(400).json({ message: "Invalid connection ID" });
    }
    
    const { status } = req.body;
    if (!status || !["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const updatedConnection = await storage.updateConnectionStatus(connectionId, status);
    if (!updatedConnection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    
    return res.json(updatedConnection);
  });
  
  app.get("/api/connections/pending", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const pendingConnections = await storage.getPendingConnections(userId);
    
    // Get user info for each connection request
    const connectionsWithUserInfo = await Promise.all(pendingConnections.map(async (conn) => {
      const user = await storage.getUser(conn.followerId);
      if (!user) return { ...conn, user: null };
      
      const { password, ...userWithoutPassword } = user;
      return { ...conn, user: userWithoutPassword };
    }));
    
    return res.json(connectionsWithUserInfo);
  });
  
  app.get("/api/connections/suggestions", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const suggestedUsers = await storage.getSuggestedConnections(userId);
    
    // Don't send passwords in response
    const usersWithoutPasswords = suggestedUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return res.json(usersWithoutPasswords);
  });

  // League routes
  app.get("/api/leagues", async (_req, res) => {
    const leagues = await storage.getAllLeagues();
    return res.json(leagues);
  });
  
  app.get("/api/leagues/subscribed", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const leagues = await storage.getUserSubscribedLeagues(userId);
    return res.json(leagues);
  });

  // Match routes
  app.get("/api/matches/live", async (_req, res) => {
    const matches = await storage.getLiveMatches();
    return res.json(matches);
  });
  
  app.get("/api/matches/upcoming", async (_req, res) => {
    const matches = await storage.getUpcomingMatches();
    return res.json(matches);
  });
  
  app.get("/api/leagues/:id/matches", async (req, res) => {
    const leagueId = parseInt(req.params.id);
    if (isNaN(leagueId)) {
      return res.status(400).json({ message: "Invalid league ID" });
    }
    
    const matches = await storage.getLeagueMatches(leagueId);
    return res.json(matches);
  });

  // Message routes
  app.get("/api/messages", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const messages = await storage.getUserMessages(userId);
    
    // Get user info for each message
    const messagesWithUserInfo = await Promise.all(messages.map(async (msg) => {
      const sender = await storage.getUser(msg.senderId);
      const receiver = await storage.getUser(msg.receiverId);
      
      const senderInfo = sender ? { 
        id: sender.id, 
        fullName: sender.fullName, 
        username: sender.username,
        avatar: sender.avatar
      } : null;
      
      const receiverInfo = receiver ? { 
        id: receiver.id, 
        fullName: receiver.fullName, 
        username: receiver.username,
        avatar: receiver.avatar
      } : null;
      
      return { ...msg, sender: senderInfo, receiver: receiverInfo };
    }));
    
    return res.json(messagesWithUserInfo);
  });
  
  app.get("/api/messages/conversation", async (req, res) => {
    const userId1 = parseInt(req.query.userId1 as string);
    const userId2 = parseInt(req.query.userId2 as string);
    
    if (isNaN(userId1) || isNaN(userId2)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }
    
    const conversation = await storage.getConversation(userId1, userId2);
    return res.json(conversation);
  });
  
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      // Check if users exist
      const sender = await storage.getUser(messageData.senderId);
      if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
      }
      
      const receiver = await storage.getUser(messageData.receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
      
      const newMessage = await storage.createMessage(messageData);
      return res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Error creating message" });
    }
  });
  
  app.get("/api/messages/unread-count", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const count = await storage.getUnreadMessageCount(userId);
    return res.json({ count });
  });

  // Subscription routes
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const subscriptionData = insertSubscriptionSchema.parse(req.body);
      
      // Check if user and league exist
      const user = await storage.getUser(subscriptionData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const league = await storage.getLeague(subscriptionData.leagueId);
      if (!league) {
        return res.status(404).json({ message: "League not found" });
      }
      
      const newSubscription = await storage.createSubscription(subscriptionData);
      return res.status(201).json(newSubscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Error creating subscription" });
    }
  });

  // Like routes
  app.post("/api/likes", async (req, res) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
      
      // Check if user and post exist
      const user = await storage.getUser(likeData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const post = await storage.getPost(likeData.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if already liked
      const isLiked = await storage.isPostLikedByUser(likeData.postId, likeData.userId);
      if (isLiked) {
        return res.status(400).json({ message: "Post already liked by user" });
      }
      
      const newLike = await storage.createLike(likeData);
      return res.status(201).json(newLike);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Error creating like" });
    }
  });
  
  app.get("/api/posts/:id/likes", async (req, res) => {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    const likes = await storage.getPostLikes(postId);
    return res.json(likes);
  });

  // Comment routes
  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      
      // Check if user and post exist
      const user = await storage.getUser(commentData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const post = await storage.getPost(commentData.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const newComment = await storage.createComment(commentData);
      return res.status(201).json(newComment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Error creating comment" });
    }
  });
  
  app.get("/api/posts/:id/comments", async (req, res) => {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    const comments = await storage.getPostComments(postId);
    
    // Get user info for each comment
    const commentsWithUserInfo = await Promise.all(comments.map(async (comment) => {
      const user = await storage.getUser(comment.userId);
      if (!user) return { ...comment, user: null };
      
      const { password, ...userWithoutPassword } = user;
      return { ...comment, user: userWithoutPassword };
    }));
    
    return res.json(commentsWithUserInfo);
  });

  const httpServer = createServer(app);
  return httpServer;
}
