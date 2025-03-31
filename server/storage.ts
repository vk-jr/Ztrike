import {
  users,
  posts,
  connections,
  leagues,
  matches,
  messages,
  subscriptions,
  likes,
  comments,
  type User,
  type InsertUser,
  type Post,
  type InsertPost,
  type Connection,
  type InsertConnection,
  type League,
  type InsertLeague,
  type Match,
  type InsertMatch,
  type Message,
  type InsertMessage,
  type Subscription,
  type InsertSubscription,
  type Like,
  type InsertLike,
  type Comment,
  type InsertComment,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;
  
  // Post methods
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  getUserPosts(userId: number): Promise<Post[]>;
  getFeedPosts(userId: number): Promise<Post[]>;
  
  // Connection methods
  getConnection(id: number): Promise<Connection | undefined>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnectionStatus(id: number, status: string): Promise<Connection | undefined>;
  getUserConnections(userId: number): Promise<Connection[]>;
  getPendingConnections(userId: number): Promise<Connection[]>;
  getSuggestedConnections(userId: number): Promise<User[]>;
  
  // League methods
  getLeague(id: number): Promise<League | undefined>;
  createLeague(league: InsertLeague): Promise<League>;
  getAllLeagues(): Promise<League[]>;
  getUserSubscribedLeagues(userId: number): Promise<League[]>;
  
  // Match methods
  getMatch(id: number): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  getUpcomingMatches(): Promise<Match[]>;
  getLiveMatches(): Promise<Match[]>;
  getLeagueMatches(leagueId: number): Promise<Match[]>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getUserMessages(userId: number): Promise<Message[]>;
  getConversation(userId1: number, userId2: number): Promise<Message[]>;
  getUnreadMessageCount(userId: number): Promise<number>;
  
  // Subscription methods
  getSubscription(id: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getUserSubscriptions(userId: number): Promise<Subscription[]>;
  
  // Like methods
  getLike(id: number): Promise<Like | undefined>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(id: number): Promise<boolean>;
  getPostLikes(postId: number): Promise<Like[]>;
  isPostLikedByUser(postId: number, userId: number): Promise<boolean>;
  
  // Comment methods
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: number): Promise<Comment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private connections: Map<number, Connection>;
  private leagues: Map<number, League>;
  private matches: Map<number, Match>;
  private messages: Map<number, Message>;
  private subscriptions: Map<number, Subscription>;
  private likes: Map<number, Like>;
  private comments: Map<number, Comment>;
  
  private currentUserId: number;
  private currentPostId: number;
  private currentConnectionId: number;
  private currentLeagueId: number;
  private currentMatchId: number;
  private currentMessageId: number;
  private currentSubscriptionId: number;
  private currentLikeId: number;
  private currentCommentId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.connections = new Map();
    this.leagues = new Map();
    this.matches = new Map();
    this.messages = new Map();
    this.subscriptions = new Map();
    this.likes = new Map();
    this.comments = new Map();
    
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentConnectionId = 1;
    this.currentLeagueId = 1;
    this.currentMatchId = 1;
    this.currentMessageId = 1;
    this.currentSubscriptionId = 1;
    this.currentLikeId = 1;
    this.currentCommentId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const user1: InsertUser = {
      username: "michaeljohnson",
      password: "password123",
      fullName: "Michael Johnson",
      email: "michael@example.com",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=100&h=100",
      sport: "Basketball",
      position: "Forward",
      team: "Atlanta Hawks",
      bio: "Professional basketball player with 5 years of experience in the NBA."
    };
    
    const user2: InsertUser = {
      username: "serenawilliams",
      password: "password123",
      fullName: "Serena Williams",
      email: "serena@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
      sport: "Tennis",
      position: "Professional Player",
      team: "WTA",
      bio: "Professional tennis player with multiple Grand Slam titles."
    };
    
    const user3: InsertUser = {
      username: "lebronjames",
      password: "password123",
      fullName: "Lebron James",
      email: "lebron@example.com",
      avatar: "https://images.unsplash.com/photo-1543637005-4d639a4e16de?auto=format&fit=crop&q=80&w=100&h=100",
      sport: "Basketball",
      position: "Professional Player",
      team: "LA Lakers",
      bio: "Professional basketball player with multiple NBA championships."
    };

    this.createUser(user1);
    this.createUser(user2);
    this.createUser(user3);

    // Create sample leagues
    const nba: InsertLeague = {
      name: "NBA",
      sport: "Basketball",
      logo: "https://images.unsplash.com/photo-1546519638-68e109acd27d?auto=format&fit=crop&q=80&w=100&h=100",
      description: "National Basketball Association"
    };
    
    const nfl: InsertLeague = {
      name: "NFL",
      sport: "American Football",
      logo: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=100&h=100",
      description: "National Football League"
    };
    
    const premierLeague: InsertLeague = {
      name: "Premier League",
      sport: "Soccer",
      logo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=100&h=100",
      description: "English Premier League"
    };

    const league1 = this.createLeague(nba);
    const league2 = this.createLeague(nfl);
    const league3 = this.createLeague(premierLeague);

    // Create sample matches
    const match1: InsertMatch = {
      leagueId: league1.id,
      team1: "Lakers",
      team2: "Celtics",
      team1Logo: "https://images.unsplash.com/photo-1546519638-68e109acd27d?auto=format&fit=crop&q=80&w=100&h=100",
      team2Logo: "https://images.unsplash.com/photo-1523194258441-4cf40465d9fe?auto=format&fit=crop&q=80&w=100&h=100",
      score1: 78,
      score2: 82,
      status: "live",
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    };
    
    const match2: InsertMatch = {
      leagueId: league3.id,
      team1: "Liverpool",
      team2: "Man City",
      team1Logo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=100&h=100",
      team2Logo: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&q=80&w=100&h=100",
      score1: 2,
      score2: 1,
      status: "live",
      startTime: new Date(),
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now
    };
    
    const match3: InsertMatch = {
      leagueId: league1.id,
      team1: "Warriors",
      team2: "Bulls",
      team1Logo: "https://images.unsplash.com/photo-1546519638-68e109acd27d?auto=format&fit=crop&q=80&w=100&h=100",
      team2Logo: "https://images.unsplash.com/photo-1518043541055-56d0cca69634?auto=format&fit=crop&q=80&w=100&h=100",
      status: "upcoming",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      endTime: new Date(Date.now() + 26 * 60 * 60 * 1000)
    };

    this.createMatch(match1);
    this.createMatch(match2);
    this.createMatch(match3);

    // Create sample posts
    const post1: InsertPost = {
      userId: 2, // Serena Williams
      content: "Training day! Working on my backhand for the upcoming tournament. Always pushing to improve. What techniques are you all working on this season? #tennis #training",
      mediaUrl: "https://images.unsplash.com/photo-1595435742656-4e610d56d8e1?auto=format&fit=crop&q=80&w=1200&h=675",
      mediaType: "image"
    };
    
    const post2: InsertPost = {
      userId: 3, // Lebron James
      content: "Game day! Ready to give it my all tonight. The team is looking strong, and we're ready to make our fans proud. #basketball #gameday",
      mediaUrl: "https://images.unsplash.com/photo-1518113883665-a043e23f2a15?auto=format&fit=crop&q=80&w=1200&h=675",
      mediaType: "video"
    };

    this.createPost(post1);
    this.createPost(post2);

    // Create sample subscriptions
    const sub1: InsertSubscription = {
      userId: 1,
      leagueId: 1
    };
    
    const sub2: InsertSubscription = {
      userId: 1,
      leagueId: 3
    };

    this.createSubscription(sub1);
    this.createSubscription(sub2);

    // Create sample connections
    const conn1: InsertConnection = {
      followerId: 1,
      followingId: 2,
      status: "accepted"
    };
    
    const conn2: InsertConnection = {
      followerId: 1,
      followingId: 3,
      status: "accepted"
    };

    this.createConnection(conn1);
    this.createConnection(conn2);

    // Create sample messages
    const msg1: InsertMessage = {
      senderId: 2,
      receiverId: 1,
      content: "Hey Michael, are you joining the charity event next week?",
      read: false
    };
    
    const msg2: InsertMessage = {
      senderId: 3,
      receiverId: 1,
      content: "Let's catch up for a training session!",
      read: false
    };

    this.createMessage(msg1);
    this.createMessage(msg2);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async searchUsers(query: string): Promise<User[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.users.values()).filter(
      (user) => 
        user.fullName.toLowerCase().includes(lowercaseQuery) ||
        user.username.toLowerCase().includes(lowercaseQuery) ||
        (user.team && user.team.toLowerCase().includes(lowercaseQuery)) ||
        (user.sport && user.sport.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Post methods
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const newPost: Post = { ...post, id, createdAt: new Date() };
    this.posts.set(id, newPost);
    return newPost;
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter((post) => post.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getFeedPosts(userId: number): Promise<Post[]> {
    // Get all connections where user is a follower
    const userConnections = Array.from(this.connections.values())
      .filter((conn) => conn.followerId === userId && conn.status === "accepted")
      .map((conn) => conn.followingId);
    
    // Include user's own posts
    userConnections.push(userId);
    
    // Get posts from all followed users and own posts
    return Array.from(this.posts.values())
      .filter((post) => userConnections.includes(post.userId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Connection methods
  async getConnection(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async createConnection(connection: InsertConnection): Promise<Connection> {
    const id = this.currentConnectionId++;
    const newConnection: Connection = { ...connection, id, createdAt: new Date() };
    this.connections.set(id, newConnection);
    return newConnection;
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection | undefined> {
    const connection = this.connections.get(id);
    if (!connection) return undefined;
    
    const updatedConnection: Connection = { ...connection, status };
    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }

  async getUserConnections(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values())
      .filter((conn) => 
        (conn.followerId === userId || conn.followingId === userId) && 
        conn.status === "accepted"
      );
  }

  async getPendingConnections(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values())
      .filter((conn) => conn.followingId === userId && conn.status === "pending");
  }

  async getSuggestedConnections(userId: number): Promise<User[]> {
    // Get all users that the current user is not connected with
    const connections = Array.from(this.connections.values())
      .filter((conn) => 
        (conn.followerId === userId || conn.followingId === userId) && 
        conn.status !== "rejected"
      );
    
    const connectedUserIds = new Set<number>();
    connections.forEach((conn) => {
      connectedUserIds.add(conn.followerId);
      connectedUserIds.add(conn.followingId);
    });
    
    return Array.from(this.users.values())
      .filter((user) => user.id !== userId && !connectedUserIds.has(user.id))
      .slice(0, 5); // Limit to 5 suggestions
  }

  // League methods
  async getLeague(id: number): Promise<League | undefined> {
    return this.leagues.get(id);
  }

  async createLeague(league: InsertLeague): Promise<League> {
    const id = this.currentLeagueId++;
    const newLeague: League = { ...league, id };
    this.leagues.set(id, newLeague);
    return newLeague;
  }

  async getAllLeagues(): Promise<League[]> {
    return Array.from(this.leagues.values());
  }

  async getUserSubscribedLeagues(userId: number): Promise<League[]> {
    const subscriptions = Array.from(this.subscriptions.values())
      .filter((sub) => sub.userId === userId)
      .map((sub) => sub.leagueId);
    
    return Array.from(this.leagues.values())
      .filter((league) => subscriptions.includes(league.id));
  }

  // Match methods
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.currentMatchId++;
    const newMatch: Match = { ...match, id };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  async getUpcomingMatches(): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter((match) => match.status === "upcoming")
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async getLiveMatches(): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter((match) => match.status === "live");
  }

  async getLeagueMatches(leagueId: number): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter((match) => match.leagueId === leagueId)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage: Message = { ...message, id, createdAt: new Date() };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.senderId === userId || msg.receiverId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getConversation(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((msg) => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getUnreadMessageCount(userId: number): Promise<number> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.receiverId === userId && !msg.read)
      .length;
  }

  // Subscription methods
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentSubscriptionId++;
    const newSubscription: Subscription = { ...subscription, id, createdAt: new Date() };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values())
      .filter((sub) => sub.userId === userId);
  }

  // Like methods
  async getLike(id: number): Promise<Like | undefined> {
    return this.likes.get(id);
  }

  async createLike(like: InsertLike): Promise<Like> {
    const id = this.currentLikeId++;
    const newLike: Like = { ...like, id, createdAt: new Date() };
    this.likes.set(id, newLike);
    return newLike;
  }

  async deleteLike(id: number): Promise<boolean> {
    return this.likes.delete(id);
  }

  async getPostLikes(postId: number): Promise<Like[]> {
    return Array.from(this.likes.values())
      .filter((like) => like.postId === postId);
  }

  async isPostLikedByUser(postId: number, userId: number): Promise<boolean> {
    return Array.from(this.likes.values())
      .some((like) => like.postId === postId && like.userId === userId);
  }

  // Comment methods
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const newComment: Comment = { ...comment, id, createdAt: new Date() };
    this.comments.set(id, newComment);
    return newComment;
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const storage = new MemStorage();
