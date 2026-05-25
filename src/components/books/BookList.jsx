"use client";

import BookCard from "./BookCard";

export default function BookList({
  books,
  onToggleRead,
  onEdit,
  onDelete,
  onRate,
}) {
  if (!books || !Array.isArray(books) || books.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No books found. Try adjusting your filters or add a new book.
      </p>
    );
  }

  const safeBooks = books.filter(
    (b) => b && typeof b === "object" && !Array.isArray(b) && b._id,
  );

  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {safeBooks.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          onToggleRead={onToggleRead}
          onEdit={onEdit}
          onDelete={onDelete}
          onRate={onRate}
        />
      ))}
    </ul>
  );
}
