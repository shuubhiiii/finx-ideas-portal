import fs from "node:fs";
import path from "node:path";

export type UserStatus = "pending" | "approved" | "rejected" | "suspended";
export type Role = "member" | "admin";

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
  bookmarks: string[]; // userIds
  likes: string[]; // userIds
  upvotes: string[]; // userIds who upvoted
  downvotes: string[]; // userIds who downvoted
}

export interface Comment {
  id: string;
  ideaId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface CollabSpace {
  id: string;
  name: string;
  description: string;
  members: string[]; // userIds
  createdAt: string;
}

export interface DB {
  users: User[];
  requests: AccessRequest[];
  ideas: Idea[];
  comments: Comment[];
  categories: string[];
  spaces: CollabSpace[];
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
  // Backfill vote arrays on older records
  for (const i of db.ideas) {
    if (!Array.isArray(i.upvotes)) i.upvotes = [];
    if (!Array.isArray(i.downvotes)) i.downvotes = [];
  }
  return db;
}

export function writeDB(db: DB) {
  ensure();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
