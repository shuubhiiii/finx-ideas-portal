"use client";
import { useState } from "react";
import clsx from "clsx";
import { Pencil, Trash2, X, Save } from "lucide-react";
import { formatDate, initials, avatarColor } from "@/lib/format";
import type { Comment, User } from "@/lib/db";

export default function CommentItem({
  comment,
  author,
  canEdit,
  canDelete,
}: {
  comment: Comment;
  author?: User;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={clsx(
              "grid h-8 w-8 place-items-center rounded-full text-white text-xs font-semibold bg-gradient-to-br shrink-0",
              avatarColor(comment.authorId)
            )}
          >
            {author ? initials(author.name) : "??"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{author?.name || "Unknown"}</div>
            <div className="text-xs text-ink-muted truncate">
              {formatDate(comment.createdAt)}
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span title={`Edited ${formatDate(comment.updatedAt)}`}> · edited</span>
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
              <form action={`/api/comments/${comment.id}/delete`} method="POST">
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
        <form action={`/api/comments/${comment.id}/edit`} method="POST" className="mt-3">
          <textarea
            name="body"
            required
            rows={3}
            defaultValue={comment.body}
            className="input resize-none"
          />
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
        <div className="mt-3 text-sm whitespace-pre-wrap">{comment.body}</div>
      )}
    </div>
  );
}
