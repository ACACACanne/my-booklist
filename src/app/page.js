"use client";

import { useEffect, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Page() {
  // ─────────────────────────────────────────────────────────────
  // AUTH STATE
  // ─────────────────────────────────────────────────────────────
  const [token, setToken] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [authError, setAuthError] = useState("");

  // ─────────────────────────────────────────────────────────────
  // BOOK STATE
  // ─────────────────────────────────────────────────────────────
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ─────────────────────────────────────────────────────────────
  // SEARCH + FILTERS + SORTING
  // ─────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortOption, setSortOption] = useState("title-asc");

  // ─────────────────────────────────────────────────────────────
  // MODALS FOR CRUD
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
  // LOAD TOKEN FROM LOCALSTORAGE
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setToken(stored);
    } else {
      setShowLoginModal(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setBooks([]);
    setShowLoginModal(true);
  };

  // ─────────────────────────────────────────────────────────────
  // LOGIN HANDLER
  // ─────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    try {
      setAuthError("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      setShowLoginModal(false);
      setLoginForm({ email: "", password: "" });
    } catch (err) {
      setAuthError(err.message);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // REGISTER HANDLER
  // ─────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    try {
      setAuthError("");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      setShowRegisterModal(false);
      setRegisterForm({ name: "", email: "", password: "" });
    } catch (err) {
      setAuthError(err.message);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // LOGIN MODAL
  // ─────────────────────────────────────────────────────────────
  const LoginModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/60">
        <h2 className="text-xl font-semibold mb-4">Log in</h2>

        {authError && <p className="text-sm text-rose-400 mb-3">{authError}</p>}

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm((f) => ({ ...f, email: e.target.value }))
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm((f) => ({ ...f, password: e.target.value }))
            }
          />
        </div>

        <div className="flex justify-between items-center mt-5">
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
          >
            Log in
          </button>

          <button
            onClick={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // REGISTER MODAL
  // ─────────────────────────────────────────────────────────────
  const RegisterModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/60">
        <h2 className="text-xl font-semibold mb-4">Create account</h2>

        {authError && <p className="text-sm text-rose-400 mb-3">{authError}</p>}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
            value={registerForm.name}
            onChange={(e) =>
              setRegisterForm((f) => ({ ...f, name: e.target.value }))
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm((f) => ({ ...f, email: e.target.value }))
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm((f) => ({ ...f, password: e.target.value }))
            }
          />
        </div>

        <div className="flex justify-between items-center mt-5">
          <button
            onClick={handleRegister}
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
          >
            Register
          </button>

          <button
            onClick={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // FETCH BOOKS (with search + filters + sorting)
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
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }

      // Client-side sorting
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
  // PATCH HELPERS (rating + read toggle)
  // ─────────────────────────────────────────────────────────────
  const patchBook = async (id, action, body = null) => {
    try {
      const res = await fetch(`/api/books/${id}?action=${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update book");
      }

      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleReadStatus = (book) => {
    patchBook(book._id, "readStatus");
  };

  const updateRating = (book, rating) => {
    patchBook(book._id, "rating", { rating });
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER RATING STARS
  // ─────────────────────────────────────────────────────────────
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
  // OPEN EDIT / DELETE MODALS
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

  // ─────────────────────────────────────────────────────────────
  // MAIN UI STARTS HERE
  // ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* HEADER */}
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

        {/* SEARCH + FILTERS */}
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

        {/* ERROR + LOADING */}
        {error && (
          <div className="mb-4 rounded-md border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-4 text-sm text-slate-400">Loading books…</div>
        )}

        {/* BOOK LIST */}
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
                      <p className="text-sm text-slate-300 line-clamp-3">
                        {book.summary}
                      </p>
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

      {/* AUTH MODALS */}
      {showLoginModal && <LoginModal />}
      {showRegisterModal && <RegisterModal />}

      {/* ADD BOOK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/60 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Add new book</h2>

            <div className="space-y-3">
              {Object.keys(addForm).map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={key.replace(/([A-Z])/g, " $1")}
                  className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                  value={addForm[key]}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-5">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/books", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(addForm),
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);

                    setShowAddModal(false);
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

                    fetchBooks();
                  } catch (err) {
                    setError(err.message);
                  }
                }}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
              >
                Add book
              </button>

              <button
                onClick={() => setShowAddModal(false)}
                className="text-sm text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BOOK MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/60 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Edit book</h2>

            <div className="space-y-3">
              {Object.keys(editForm)
                .filter((key) => key !== "_id")
                .map((key) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={key.replace(/([A-Z])/g, " $1")}
                    className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
                    value={editForm[key]}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                  />
                ))}
            </div>

            <div className="flex justify-between items-center mt-5">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/books/${editForm._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(editForm),
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);

                    setShowEditModal(false);
                    fetchBooks();
                  } catch (err) {
                    setError(err.message);
                  }
                }}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
              >
                Save changes
              </button>

              <button
                onClick={() => setShowEditModal(false)}
                className="text-sm text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/60">
            <h2 className="text-xl font-semibold mb-4">Delete book</h2>

            <p className="text-sm text-slate-300 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteTarget.title}</span>?
            </p>

            <div className="flex justify-between items-center">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/books/${deleteTarget._id}`, {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);

                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                    fetchBooks();
                  } catch (err) {
                    setError(err.message);
                  }
                }}
                className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-sm font-medium"
              >
                Delete
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-sm text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
