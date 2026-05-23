"use client";
import { useState } from "react";
import clsx from "clsx";
import { Pencil, Trash2, X, Save, Heart, MessageSquare, Send, Flag } from "lucide-react";
import { formatDate, initials, avatarColor } from "@/lib/format";

export interface CommentItemProps {
  id: string;
  ideaId: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt?: string;
  bodyHtml: string;
  rawBody: string;
  likes: number;
  likedByMe: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canReply?: boolean;
  canReport?: boolean;
  replies?: Omit<CommentItemProps, "replies" | "canReply">[];
}

function Avatar({ authorId, authorName }: { authorId: string; authorName?: string }) {
  return (
    <div
      className={clsx(
        "grid h-8 w-8 place-items-center rounded-full text-white text-xs font-semibold bg-gradient-to-br shrink-0",
        avatarColor(authorId)
      )}
    >
      {authorName ? initials(authorName) : "??"}
    </div>
  );
}

function CommentBody(props: CommentItemProps) {
  const {
    id, ideaId, authorId, authorName, createdAt, updatedAt,
    bodyHtml, rawBody, likes, likedByMe, canEdit, canDelete, canReply, canReport,
  } = props;
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar authorId={authorId} authorName={authorName} />
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{authorName || "Unknown"}</div>
            <div className="text-xs text-ink-muted truncate">
              {formatDate(createdAt)}
              {updatedAt && updatedAt !== createdAt && (
                <span title={`Edited ${formatDate(updatedAt)}`}> · edited</span>
              )}
            </div>
          </div>
        </div>

        {(canEdit || canDelete) && !editing && (
          <div className="flex items-center gap-1">
            {canEdit && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn-ghost p-2"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {canDelete && (
              <form action={`/api/comments/${id}/delete`} method="POST">
                <button
                  type="submit"
                  className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {editing ? (
        <form action={`/api/comments/${id}/edit`} method="POST" className="mt-3">
          <textarea
            name="body"
            required
            rows={3}
            defaultValue={rawBody}
            className="input resize-none"
          />
          <div className="mt-1 text-xs text-ink-muted">
            Tip: supports **bold**, *italic*, `code`, links, lists, and @mentions.
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-ghost"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </form>
      ) : (
        <div
          className="prose-comment mt-3 text-sm leading-relaxed text-ink space-y-2"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      )}

      {!editing && (
        <div className="mt-3 flex items-center gap-1">
          <form action={`/api/comments/${id}/like`} method="POST">
            <button
              type="submit"
              className={clsx(
                "btn-ghost p-2 text-xs",
                likedByMe && "text-rose-600 bg-rose-50/60"
              )}
              title={likedByMe ? "Unlike" : "Like"}
            >
              <Heart className={clsx("h-3.5 w-3.5", likedByMe && "fill-rose-500")} /> {likes || 0}
            </button>
          </form>
          {canReply && (
            <button
              type="button"
              onClick={() => setReplying((r) => !r)}
              className={clsx("btn-ghost p-2 text-xs", replying && "bg-silver-100")}
              title="Reply"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Reply
            </button>
          )}
          {canReport && (
            <details className="relative ml-auto">
              <summary className="btn-ghost p-2 text-xs text-ink-muted hover:text-rose-700 list-none cursor-pointer" title="Report">
                <Flag className="h-3.5 w-3.5" />
              </summary>
              <form
                action={`/api/comments/${id}/report`}
                method="POST"
                className="absolute right-0 z-20 mt-1 w-64 rounded-xl border border-silver-200 bg-white p-3 shadow-lg"
              >
                <label className="label">Reason</label>
                <textarea
                  name="reason"
                  rows={3}
                  required
                  maxLength={500}
                  className="input mt-1 resize-none text-sm"
                  placeholder="Why is this comment a problem?"
                />
                <div className="mt-2 flex justify-end">
                  <button type="submit" className="btn-primary text-xs">
                    <Flag className="h-3.5 w-3.5" /> Report
                  </button>
                </div>
              </form>
            </details>
          )}
        </div>
      )}

      {replying && canReply && (
        <form action={`/api/ideas/${ideaId}/comment`} method="POST" className="mt-3">
          <input type="hidden" name="parentId" value={id} />
          <textarea
            name="body"
            required
            rows={2}
            className="input resize-none"
            placeholder={`Reply to ${authorName || "comment"}…`}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setReplying(false)} className="btn-ghost">
              <X className="h-4 w-4" /> Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Send className="h-4 w-4" /> Reply
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function CommentItem(props: CommentItemProps) {
  const { replies, ...self } = props;
  return (
    <div className="space-y-2">
      <CommentBody {...self} canReply={self.canReply ?? true} />
      {replies && replies.length > 0 && (
        <div className="ml-6 sm:ml-10 space-y-2 border-l-2 border-silver-200 pl-3 sm:pl-4">
          {replies.map((r) => (
            <CommentBody key={r.id} {...r} canReply={false} />
          ))}
        </div>
      )}
    </div>
  );
}
