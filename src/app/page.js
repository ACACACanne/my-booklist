"use client";

import { useEffect, useState, useCallback } from "react";

export default function Page() {
  // ─────────────────────────────────────────────────────────────
  // Auth & core state
  // ─────────────────────────────────────────────────────────────
  const [token, setToken] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ─────────────────────────────────────────────────────────────
  // Search, filters, sorting
  // ─────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortOption, setSortOption] = useState("title-asc");

  // ─────────────────────────────────────────────────────────────
  // Modals & forms
  // ─────────────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [addForm, setAddForm] = useState({
    title: "",
    author: "",
    genre: "",
    publishedYear: "",
    coverImageUrl: "",
    purchaseLink: "",
    readOnlineLink: "",
    summary: "",
  });

  const [editForm, setEditForm] = useState({
    _id: "",
    title: "",
    author: "",
    genre: "",
    publishedYear: "",
    coverImageUrl: "",
    purchaseLink: "",
    readOnlineLink: "",
    summary: "",
    rating: 0,
    read: false,
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  // ─────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────
  const resetAddForm = () => {
    setAddForm({
      title: "",
      author: "",
      genre: "",
      publishedYear: "",
      coverImageUrl: "",
      purchaseLink: "",
      readOnlineLink: "",
      summary: "",
    });
  };

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setEditForm({
      _id: "",
      title: "",
      author: "",
      genre: "",
      publishedYear: "",
      coverImageUrl: "",
      purchaseLink: "",
      readOnlineLink: "",
      summary: "",
      rating: 0,
      read: false,
    });
    setDeleteTarget(null);
  };

  // ─────────────────────────────────────────────────────────────
  // Auth: load token from localStorage
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = window.localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setToken("");
    setBooks([]);
  };

  // ─────────────────────────────────────────────────────────────
  // Fetch books with search + filters + sorting
  // ─────────────────────────────────────────────────────────────
  const fetchBooks = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (genreFilter) params.append("genre", genreFilter);
      if (readFilter) params.append("read", readFilter);
      if (ratingFilter) params.append("minRating", ratingFilter);

      const res = await fetch(`/api/books?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch books");
      }

      const data = await res.json();

      // client-side sorting for flexibility
      const sorted = [...data].sort((a, b) => {
        switch (sortOption) {
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          case "author-asc":
            return a.author.localeCompare(b.author);
          case "author-desc":
            return b.author.localeCompare(a.author);
          case "rating-desc":
            return (b.rating || 0) - (a.rating || 0);
          case "year-desc":
            return (b.publishedYear || 0) - (a.publishedYear || 0);
          case "year-asc":
            return (a.publishedYear || 0) - (b.publishedYear || 0);
          default:
            return a.title.localeCompare(b.title);
        }
      });

      setBooks(sorted);
    } catch (err) {
      setError(err.message || "Error fetching books");
    } finally {
      setLoading(false);
    }
  }, [token, search, genreFilter, readFilter, ratingFilter, sortOption]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // ─────────────────────────────────────────────────────────────
  // CRUD operations
  // ─────────────────────────────────────────────────────────────
  const createBook = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create book");
      }

      resetAddForm();
      setShowAddModal(false);
      fetchBooks();
    } catch (err) {
      setError(err.message || "Error creating book");
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async () => {
    if (!editForm._id) return;
    try {
      setLoading(true);
      setError("");

      const payload = {
        ...editForm,
        publishedYear: editForm.publishedYear
          ? parseInt(editForm.publishedYear, 10)
          : undefined,
      };

      const res = await fetch(`/api/books/${editForm._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update book");
      }

      setShowEditModal(false);
      fetchBooks();
    } catch (err) {
      setError(err.message || "Error updating book");
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async () => {
    if (!deleteTarget?._id) return;
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/books/${deleteTarget._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete book");
      }

      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchBooks();
    } catch (err) {
      setError(err.message || "Error deleting book");
    } finally {
      setLoading(false);
    }
  };

  const patchBook = async (id, action, body = null) => {
    try {
      setError("");

      const res = await fetch(`/api/books/${id}?action=${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to update book");
      }

      fetchBooks();
    } catch (err) {
      setError(err.message || "Error updating book");
    }
  };

  const toggleReadStatus = (book) => {
    patchBook(book._id, "readStatus");
  };

  const updateRating = (book, rating) => {
    patchBook(book._id, "rating", { rating });
  };

  // ─────────────────────────────────────────────────────────────
  // UI helpers
  // ─────────────────────────────────────────────────────────────
  const openEditModal = (book) => {
    setEditForm({
      _id: book._id,
      title: book.title || "",
      author: book.author || "",
      genre: book.genre || "",
      publishedYear: book.publishedYear ? String(book.publishedYear) : "",
      coverImageUrl: book.coverImageUrl || "",
      purchaseLink: book.purchaseLink || "",
      readOnlineLink: book.readOnlineLink || "",
      summary: book.summary || "",
      rating: book.rating || 0,
      read: !!book.read,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (book) => {
    setDeleteTarget(book);
    setShowDeleteModal(true);
  };

  const renderRatingStars = (book) => {
    const stars = [];
    const current = book.rating || 0;
    for (let i = 1; i <= 5; i++) {
      const filled = i <= current;
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => updateRating(book, i)}
          className={`text-lg transition-colors ${
            filled ? "text-yellow-400" : "text-gray-500 hover:text-yellow-300"
          }`}
        >
          ★
        </button>,
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              My Book Library
            </h1>
            <p className="text-slate-400 mt-1">
              Track, rate, and explore your personal collection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {token ? (
              <>
                <span className="text-sm text-slate-400">
                  Authenticated session
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm font-medium border border-slate-700"
                >
                  Log out
                </button>
              </>
            ) : (
              <span className="text-sm text-rose-400">
                No token found. Please log in to manage books.
              </span>
            )}
          </div>
        </header>

        {/* Controls: Filters + Sort + Add */}
        <section className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search by title, author, genre, summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Filter by genre"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            />

            <select
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
            >
              <option value="">All books</option>
              <option value="true">Read</option>
              <option value="false">Unread</option>
            </select>

            <select
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">Any rating</option>
              <option value="1">1+ stars</option>
              <option value="2">2+ stars</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="5">5 stars only</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="title-asc">Title (A → Z)</option>
                <option value="title-desc">Title (Z → A)</option>
                <option value="author-asc">Author (A → Z)</option>
                <option value="author-desc">Author (Z → A)</option>
                <option value="rating-desc">Rating (high → low)</option>
                <option value="year-desc">Year (new → old)</option>
                <option value="year-asc">Year (old → new)</option>
              </select>

              <button
                className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:bg-slate-700"
                onClick={() => {
                  setSearch("");
                  setGenreFilter("");
                  setReadFilter("");
                  setRatingFilter("");
                }}
              >
                Clear filters
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              disabled={!token}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-sm font-medium shadow-sm shadow-indigo-900/40"
            >
              + Add new book
            </button>
          </div>
        </section>

        {/* Error & loading */}
        {error && (
          <div className="mb-4 rounded-md border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-4 text-sm text-slate-400">Loading books…</div>
        )}

        {/* Book list */}
        <section className="space-y-4">
          {books.length === 0 && !loading ? (
            <p className="text-sm text-slate-400">
              No books found. Try adjusting your filters or add a new book.
            </p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <li
                  key={book._id}
                  className="flex flex-col h-full rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-lg shadow-black/40 overflow-hidden"
                >
                  {/* Cover */}
                  {book.coverImageUrl && (
                    <div className="h-40 w-full overflow-hidden bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
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
                      <p className="text-sm text-slate-300 line-clamp-3">
                        {book.summary}
                      </p>
                    )}

                    {/* Links */}
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

                    {/* Rating + actions */}
                    <div className="mt-auto pt-2 flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400">Rating</span>
                        {renderRatingStars(book)}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleReadStatus(book)}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700"
                        >
                          Mark as {book.read ? "unread" : "read"}
                        </button>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(book)}
                            className="px-3 py-1 rounded-md text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(book)}
                            className="px-3 py-1 rounded-md text-xs bg-rose-600 hover:bg-rose-500 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────
          Add Book Modal
      ───────────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg rounded-xl bg-slate-950 border border-slate-800 shadow-2xl shadow-black/60 p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Add new book</h2>
              <button
                onClick={closeAllModals}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                placeholder="Title *"
                value={addForm.title}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                placeholder="Author *"
                value={addForm.author}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, author: e.target.value }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                placeholder="Genre"
                value={addForm.genre}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, genre: e.target.value }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                placeholder="Published year"
                value={addForm.publishedYear}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, publishedYear: e.target.value }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm md:col-span-2"
                placeholder="Cover image URL"
                value={addForm.coverImageUrl}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, coverImageUrl: e.target.value }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm md:col-span-2"
                placeholder="Purchase link"
                value={addForm.purchaseLink}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, purchaseLink: e.target.value }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm md:col-span-2"
                placeholder="Read online link"
                value={addForm.readOnlineLink}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, readOnlineLink: e.target.value }))
                }
              />
              <textarea
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm md:col-span-2 min-h-[80px]"
                placeholder="Summary"
                value={addForm.summary}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, summary: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeAllModals}
                className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={createBook}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          Edit Book Modal
      ───────────────────────────────────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg rounded-xl bg-slate-950 border border-slate-800 shadow-2xl shadow-black/60 p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Edit book</h2>
              <button
                onClick={closeAllModals}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                placeholder="Title *"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                placeholder="Author *"
                value={editForm.author}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, author: e.target.value }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                placeholder="Genre"
                value={editForm.genre}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, genre: e.target.value }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                placeholder="Published year"
                value={editForm.publishedYear}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    publishedYear: e.target.value,
                  }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm md:col-span-2"
                placeholder="Cover image URL"
                value={editForm.coverImageUrl}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    coverImageUrl: e.target.value,
                  }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm md:col-span-2"
                placeholder="Purchase link"
                value={editForm.purchaseLink}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    purchaseLink: e.target.value,
                  }))
                }
              />
              <input
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm md:col-span-2"
                placeholder="Read online link"
                value={editForm.readOnlineLink}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    readOnlineLink: e.target.value,
                  }))
                }
              />
              <textarea
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm md:col-span-2 min-h-[80px]"
                placeholder="Summary"
                value={editForm.summary}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, summary: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeAllModals}
                className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={updateBook}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          Delete Confirmation Modal
      ───────────────────────────────────────────────────────── */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-xl bg-slate-950 border border-slate-800 shadow-2xl shadow-black/60 p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Delete book</h2>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteTarget.title}</span> by{" "}
              <span className="font-semibold">
                {deleteTarget.author || "Unknown author"}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeAllModals}
                className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteBook}
                className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
