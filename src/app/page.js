"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState(null);
  const [sortOption, setSortOption] = useState("title-asc");

  function getSortedBooks() {
    const sorted = [...books];

    switch (sortOption) {
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "author-asc":
        sorted.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "author-desc":
        sorted.sort((a, b) => b.author.localeCompare(a.author));
        break;
      case "year-asc":
        sorted.sort((a, b) => (a.publishedYear || 0) - (b.publishedYear || 0));
        break;
      case "year-desc":
        sorted.sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0));
        break;
      case "rating-asc":
        sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "rating-desc":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "read-status":
        sorted.sort((a, b) => (b.read === true) - (a.read === true));
        break;
      case "unread-status":
        sorted.sort((a, b) => (a.read === true) - (b.read === true));
        break;
      case "genre-asc":
        sorted.sort((a, b) => (a.genre || "").localeCompare(b.genre || ""));
        break;
      case "genre-desc":
        sorted.sort((a, b) => (b.genre || "").localeCompare(a.genre || ""));
        break;
      default:
        break;
    }

    return sorted;
  }

  // Modal toggles
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Add book form state
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publishedYear: "",
    coverImageUrl: "",
    purchaseLink: "",
    readOnlineLink: "",
    summary: "",
    read: false,
  });

  // Edit book form state
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
    read: false,
  });

  //  Load books
  async function loadBooks() {
    const res = await fetch("/api/books");
    const data = await res.json();
    const normalized = data.map((b) => ({ ...b, _id: b._id || b.id }));
    setBooks(normalized);
  }

  useEffect(() => {
    // Restore token from localStorage
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) setToken(savedToken);
    loadBooks();
  }, []);

  // Login
  async function loginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
      localStorage.setItem("authToken", data.token); // persist
      setShowLogin(false);
    } else {
      alert(data.message || "Login failed");
    }
  }

  // Register
  async function registerSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registration successful! You can now log in.");
      setShowRegister(false);
    } else {
      alert(data.message || "Registration failed");
    }
  }

  // Add Book
  async function addBookSubmit(e) {
    e.preventDefault();

    if (!token) {
      alert("🚫 You must be logged in to add a book.");
      return;
    }

    const res = await fetch("/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        publishedYear: form.publishedYear
          ? parseInt(form.publishedYear)
          : undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "❌ Failed to add book");
      return;
    }

    alert("✅ Book added successfully!");
    setShowAdd(false);
    setForm({
      title: "",
      author: "",
      genre: "",
      publishedYear: "",
      coverImageUrl: "",
      purchaseLink: "",
      readOnlineLink: "",
      summary: "",
      read: false,
    });
    loadBooks();
  }

  // Patch book (rating / read status)
  async function patchBook(id, action, body) {
    if (!token) {
      alert("🚫 You must be logged in to perform this action.");
      return;
    }

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`/api/books/${id}?action=${action}`, options);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "❌ Action failed");
      return;
    }

    loadBooks();
  }

  // Edit Book
  async function editBookSubmit(e) {
    e.preventDefault();
    if (!token) {
      alert("Unauthorized: missing token");
      return;
    }
    if (!editForm._id && !editForm.id) {
      alert("Missing _id for edit");
      return;
    }

    const id = editForm._id || editForm.id;

    const res = await fetch(`/api/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...editForm,
        publishedYear: editForm.publishedYear
          ? parseInt(editForm.publishedYear)
          : undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message || `Failed to edit (status ${res.status})`);
      return;
    }

    setShowEdit(false);
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
      read: false,
    });
    loadBooks();
  }

  function openEditModal(book) {
    setEditForm({ ...book, _id: book._id || book.id }); // ✅ ensure _id
    setShowEdit(true);
  }

  // Delete Book
  async function deleteBook(id) {
    if (!token) {
      alert("🚫 You must be logged in to delete a book.");
      return;
    }
    if (!confirm("Are you sure you want to delete this book?")) return;

    const res = await fetch(`/api/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "❌ Failed to delete book");
      return;
    }

    alert("✅ Book deleted successfully!");
    loadBooks();
  }

  return (
    <main className="min-h-screen bg-[url('/assets/images/library.jpg')] bg-cover bg-center text-white">
      <div className="bg-black/60 min-h-screen px-6 py-10 relative">
        {/* Auth buttons */}
        <div className="absolute top-4 right-6 z-50 flex gap-4">
          {token ? (
            <button
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                setToken(null);
                localStorage.removeItem("authToken");
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="bg-white text-black font-semibold px-4 py-2 rounded hover:bg-gray-200"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button
                className="bg-white text-black font-semibold px-4 py-2 rounded hover:bg-gray-200"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">📚 My Book List</h1>
          <p className="text-lg text-white">
            Manage your personal library. Add, edit, and explore your books with
            ease.
          </p>
        </header>

        {/* Controls */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              className="bg-white text-black font-semibold px-6 py-2 rounded hover:bg-gray-200"
              onClick={() => setShowAdd(true)}
            >
              Add Book
            </button>
            <button
              className="bg-white text-black font-semibold px-6 py-2 rounded hover:bg-gray-200"
              onClick={loadBooks}
            >
              View Book List
            </button>
          </div>
        </section>
        <section className="p-4">
          {/* Sort options */}
          <section className="mb-6 max-w-sm mx-auto bg-black/30 p-4 rounded">
            <div>
              <label
                htmlFor="sort"
                className="block text-white font-medium mb-2"
              >
                Sort Books
              </label>
              <select
                id="sort"
                name="sort"
                className="w-full p-2 rounded border text-white bg-black border-white/50"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="author-asc">Author (A-Z)</option>
                <option value="author-desc">Author (Z-A)</option>
                <option value="year-asc">
                  Published Year (Oldest to Newest)
                </option>
                <option value="year-desc">
                  Published Year (Newest to Oldest)
                </option>
                <option value="rating-asc">Rating (Lowest to Highest)</option>
                <option value="rating-desc">Rating (Highest to Lowest)</option>
                <option value="read-status">Read Status</option>
                <option value="unread-status">Unread Status</option>
                <option value="genre-asc">Genre (A-Z)</option>
                <option value="genre-desc">Genre (Z-A)</option>
              </select>
            </div>
          </section>

          {/* Book list */}
          <section className="mb-10 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">📖 Your Books</h2>
            <ul className="space-y-6">
              {getSortedBooks().map(
                (
                  book 
                ) => (
                  <li key={book._id} className="bg-white/10 p-4 rounded shadow">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <img
                        src={book.coverImageUrl || "/default-cover.jpg"}
                        alt={`Cover of ${book.title}`}
                        className="w-24 h-auto rounded shadow"
                      />
                      <div className="flex-1">
                        <strong>Title:</strong> {book.title}
                        <br />
                        <em>Author:</em> {book.author}
                        <br />
                        <span>Genre: {book.genre}</span>
                        <br />
                        <span>Published: {book.publishedYear || "N/A"}</span>
                        <br />
                        <span>Rating: {(book.rating || 0).toFixed(1)} / 5</span>
                        <br />
                        <span>
                          Status:{" "}
                          <span
                            className={
                              book.read ? "text-green-400" : "text-red-400"
                            }
                          >
                            {book.read ? "Read" : "Unread"}
                          </span>
                        </span>
                        <br />
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button
                              key={r}
                              className="bg-yellow-400 text-black font-semibold px-2 py-1 rounded hover:bg-yellow-500 transition"
                              onClick={() => {
                                patchBook(book._id, "rating", { rating: r });
                              }}
                            >
                              {r}
                            </button>
                          ))}

                          <button
                            className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition"
                            onClick={() => patchBook(book._id, "readStatus")}
                          >
                            Mark as {book.read ? "Unread" : "Read"}
                          </button>

                          {/* Edit and Delete buttons */}
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                            onClick={() => openEditModal(book)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            onClick={() => {
                              const id = editForm._id || editForm.id;
                              if (!id) {
                                alert("Missing _id for delete");
                                return;
                              }
                              deleteBook(id);
                              setShowDelete(false);
                              setEditForm({});
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="md:w-1/2 w-full bg-white/10 p-3 rounded text-sm text-white border border-white/20">
                        <h3 className="font-semibold">Summary:</h3>
                        <p>{book.summary || "No summary available."}</p>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
          </section>
        </section>

        {/* Login modal */}
        {showLogin && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
                onClick={() => setShowLogin(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">🔐 Login</h2>
              <form onSubmit={loginSubmit} className="space-y-4">
                <input
                  name="username"
                  placeholder="Username"
                  required
                  className="w-full p-2 rounded border"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full p-2 rounded border"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Register modal */}
        {showRegister && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
                onClick={() => setShowRegister(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">📝 Register</h2>
              <form onSubmit={registerSubmit} className="space-y-4">
                <input
                  name="username"
                  placeholder="Username"
                  required
                  className="w-full p-2 rounded border"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-2 rounded border"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full p-2 rounded border"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Add Book modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-xl shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
                onClick={() => setShowAdd(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">➕ Add a New Book</h2>
              <form
                onSubmit={addBookSubmit}
                className="grid md:grid-cols-2 gap-4"
              >
                <input
                  className="p-2 rounded border"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Genre"
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                />
                <input
                  className="p-2 rounded border"
                  type="number"
                  placeholder="Published Year"
                  value={form.publishedYear}
                  onChange={(e) =>
                    setForm({ ...form, publishedYear: e.target.value })
                  }
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Cover Image URL"
                  value={form.coverImageUrl}
                  onChange={(e) =>
                    setForm({ ...form, coverImageUrl: e.target.value })
                  }
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Purchase Link"
                  value={form.purchaseLink}
                  onChange={(e) =>
                    setForm({ ...form, purchaseLink: e.target.value })
                  }
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Read Online URL"
                  value={form.readOnlineLink}
                  onChange={(e) =>
                    setForm({ ...form, readOnlineLink: e.target.value })
                  }
                />
                <input
                  className="p-2 rounded border md:col-span-2"
                  placeholder="Summary"
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                />
                <label className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.read}
                    onChange={(e) =>
                      setForm({ ...form, read: e.target.checked })
                    }
                  />
                  Mark as Read
                </label>
                <button
                  type="submit"
                  className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Add Book
                </button>
              </form>
            </div>
          </div>
        )}
        {/* Edit Book modal */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-xl shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
                onClick={() => setShowEdit(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">✏️ Edit Book</h2>
              <form
                onSubmit={editBookSubmit}
                className="grid md:grid-cols-2 gap-4"
              >
                <input
                  className="p-2 rounded border"
                  placeholder="Title"
                  value={editForm.title || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  required
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Author"
                  value={editForm.author || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, author: e.target.value })
                  }
                  required
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Genre"
                  value={editForm.genre || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, genre: e.target.value })
                  }
                />
                <input
                  className="p-2 rounded border"
                  type="number"
                  placeholder="Published Year"
                  value={editForm.publishedYear || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, publishedYear: e.target.value })
                  }
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Cover Image URL"
                  value={editForm.coverImageUrl || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, coverImageUrl: e.target.value })
                  }
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Purchase Link"
                  value={editForm.purchaseLink || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, purchaseLink: e.target.value })
                  }
                />
                <input
                  className="p-2 rounded border"
                  placeholder="Read Online URL"
                  value={editForm.readOnlineLink || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, readOnlineLink: e.target.value })
                  }
                />
                <input
                  className="p-2 rounded border md:col-span-2"
                  placeholder="Summary"
                  value={editForm.summary || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, summary: e.target.value })
                  }
                />
                <label className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.read || false}
                    onChange={(e) =>
                      setEditForm({ ...editForm, read: e.target.checked })
                    }
                  />
                  Mark as Read
                </label>
                <button
                  type="submit"
                  className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Book modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
                onClick={() => setShowDelete(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">🗑️ Delete Book</h2>
              <p>
                Are you sure you want to delete{" "}
                <strong>{editForm.title}</strong>?
              </p>
              <div className="mt-4 flex gap-4 justify-end">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={() => {
                    deleteBook(editForm._id); // use MongoDB _id
                    setShowDelete(false);
                    setEditForm({});
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
