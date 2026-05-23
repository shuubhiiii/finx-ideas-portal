import fs from "node:fs";
import path from "node:path";

export type UserStatus = "pending" | "approved" | "rejected" | "suspended";
export type Role = "member" | "admin";
export type IdeaStatus = "new" | "under_review" | "in_progress" | "shipped" | "declined";

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  skills: string;
  reason: string;
  link?: string;
  status: UserStatus;
  createdAt: string;
  passwordHash?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  skills: string;
  bio?: string;
  link?: string;
  joinedAt: string;
  following?: string[]; // userIds this user follows
}

export interface Idea {
  id: string;
  authorId: string;
  title: string;
  body: string;
  summary?: string;
  category: string;
  tags: string[];
  visibility: "community" | "internal";
  createdAt: string;
  updatedAt?: string;
  status: IdeaStatus;
  statusNote?: string;
  bookmarks: string[]; // userIds
  likes: string[]; // userIds
  upvotes: string[]; // userIds who upvoted
  downvotes: string[]; // userIds who downvoted
  subscribers?: string[]; // userIds subscribed to activity on this idea
  reactions?: Record<string, string[]>; // emoji -> userIds
  pinned?: boolean;
  locked?: boolean;
  reports?: Report[];
}

export interface Comment {
  id: string;
  ideaId: string;
  authorId: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  likes?: string[]; // userIds
  reports?: Report[];
}

export interface Report {
  id: string;
  reporterId: string;
  reason: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface CollabSpace {
  id: string;
  name: string;
  description: string;
  members: string[]; // userIds
  createdAt: string;
}

export type NotificationType =
  | "comment_on_idea"
  | "reply_to_comment"
  | "mention"
  | "status_change"
  | "comment_like"
  | "new_follower"
  | "subscribed_comment";

export interface Notification {
  id: string;
  userId: string; // recipient
  type: NotificationType;
  ideaId?: string;
  commentId?: string;
  fromUserId?: string;
  text?: string;
  createdAt: string;
  readAt?: string;
}

export interface DB {
  users: User[];
  requests: AccessRequest[];
  ideas: Idea[];
  comments: Comment[];
  categories: string[];
  spaces: CollabSpace[];
  notifications?: Notification[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const seed = require("./seed").seedData() as DB;
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf-8");
  }
}

export function readDB(): DB {
  ensure();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  const db = JSON.parse(raw) as DB;
  // Backfill fields on older records
  for (const u of db.users) {
    if (!Array.isArray(u.following)) u.following = [];
  }
  for (const i of db.ideas) {
    if (!Array.isArray(i.upvotes)) i.upvotes = [];
    if (!Array.isArray(i.downvotes)) i.downvotes = [];
    if (!i.status) i.status = "new";
    if (!Array.isArray(i.subscribers)) i.subscribers = [i.authorId];
    if (!i.reactions || typeof i.reactions !== "object") i.reactions = {};
    if (typeof i.pinned !== "boolean") i.pinned = false;
    if (typeof i.locked !== "boolean") i.locked = false;
    if (!Array.isArray(i.reports)) i.reports = [];
  }
  for (const c of db.comments) {
    if (!Array.isArray(c.likes)) c.likes = [];
    if (!Array.isArray(c.reports)) c.reports = [];
  }
  if (!Array.isArray(db.notifications)) db.notifications = [];
  return db;
}

export function writeDB(db: DB) {
  ensure();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
