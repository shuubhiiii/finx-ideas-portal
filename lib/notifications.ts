import { uid, type DB, type Notification, type NotificationType } from "./db";

export function notify(
  db: DB,
  args: {
    userId: string;
    type: NotificationType;
    ideaId?: string;
    commentId?: string;
    fromUserId?: string;
    text?: string;
  }
) {
  if (!db.notifications) db.notifications = [];
  // Don't notify yourself
  if (args.fromUserId && args.fromUserId === args.userId) return;
  // Recipient must exist
  if (!db.users.some((u) => u.id === args.userId)) return;
  const n: Notification = {
    id: uid("ntf"),
    userId: args.userId,
    type: args.type,
    ideaId: args.ideaId,
    commentId: args.commentId,
    fromUserId: args.fromUserId,
    text: args.text,
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(n);
}

export function unreadCount(db: DB, userId: string): number {
  if (!db.notifications) return 0;
  return db.notifications.filter((n) => n.userId === userId && !n.readAt).length;
}
