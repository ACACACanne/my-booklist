"use client";

import RatingStars from "./RatingStars";

export default function BookCard({
  book,
  onToggleRead,
  onEdit,
  onDelete,
  onRate,
}) {
  return (
    <li className="flex flex-col h-full rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-lg shadow-black/40 overflow-hidden">
      {/* COVER */}
      {book.coverImageUrl && (
        <div className="h-40 w-full overflow-hidden bg-slate-950">
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {book.title}
            </h2>
            <p className="text-sm text-slate-400">
              {book.author || "Unknown author"}
            </p>
          </div>

          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              book.read
                ? "bg-emerald-900/60 text-emerald-200 border border-emerald-700/60"
                : "bg-slate-900 text-slate-300 border border-slate-700"
            }`}
          >
            {book.read ? "Read" : "Unread"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          {book.genre && (
            <span className="px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700/80">
              {book.genre}
            </span>
          )}
          {book.publishedYear && (
            <span className="px-2 py-1 rounded-full bg-slate-900 border border-slate-700">
              {book.publishedYear}
            </span>
          )}
        </div>

        {book.summary && (
          <p className="text-sm text-slate-300 line-clamp-3">{book.summary}</p>
        )}

        {/* LINKS */}
        <div className="flex flex-wrap gap-2 text-xs mt-1">
          {book.purchaseLink && (
            <a
              href={book.purchaseLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
            >
              Buy
            </a>
          )}

          {book.readOnlineLink && (
            <a
              href={book.readOnlineLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
            >
              Read online
            </a>
          )}
        </div>

        {/* RATING + ACTIONS */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400">Rating</span>
            <RatingStars
              rating={book.rating || 0}
              onRate={(r) => onRate(book, r)}
            />
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => onToggleRead(book)}
              className="px-3 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              Mark as {book.read ? "unread" : "read"}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(book)}
                className="px-3 py-1 rounded-md text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(book)}
                className="px-3 py-1 rounded-md text-xs bg-rose-600 hover:bg-rose-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
