"use client";

import useAuth from "@/hooks/useAuth";
import useBooks from "@/hooks/useBooks";

import BookList from "@/components/books/BookList";

import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import AddBookModal from "@/components/modals/AddBookModal";
import EditBookModal from "@/components/modals/EditBookModal";
import DeleteBookModal from "@/components/modals/DeleteBookModal";

export default function Page() {
  const auth = useAuth();
  const books = useBooks(auth.token);

  if (!auth.ready) return <div className="p-10">Loading...</div>;

  if (!auth.token) {
    return (
      <div className="p-10 space-y-4">
        <h1 className="text-3xl font-bold">My Booklist</h1>

        <div className="flex gap-3">
          <button
            onClick={() => auth.setShowLoginModal(true)}
            className="px-4 py-2 rounded bg-indigo-600"
          >
            Login
          </button>

          <button
            onClick={() => auth.setShowRegisterModal(true)}
            className="px-4 py-2 rounded bg-emerald-600"
          >
            Register
          </button>
        </div>

        <LoginModal
          show={auth.showLoginModal}
          onClose={() => auth.setShowLoginModal(false)}
          form={auth.loginForm}
          setForm={auth.setLoginForm}
          onSubmit={auth.handleLogin}
          error={auth.authError}
        />

        <RegisterModal
          show={auth.showRegisterModal}
          onClose={() => auth.setShowRegisterModal(false)}
          form={auth.registerForm}
          setForm={auth.setRegisterForm}
          onSubmit={auth.handleRegister}
          error={auth.authError}
        />
      </div>
    );
  }

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">My Booklist</h1>

        <button
          onClick={auth.handleLogout}
          className="px-3 py-1 rounded bg-rose-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-900 p-4 rounded-xl">
        <input
          placeholder="Search title..."
          value={books.filters.search}
          onChange={(e) =>
            books.setFilters((f) => ({ ...f, search: e.target.value }))
          }
          className="px-3 py-2 rounded bg-slate-800"
        />

        <input
          placeholder="Genre"
          value={books.filters.genre}
          onChange={(e) =>
            books.setFilters((f) => ({ ...f, genre: e.target.value }))
          }
          className="px-3 py-2 rounded bg-slate-800"
        />

        <select
          value={books.filters.read}
          onChange={(e) =>
            books.setFilters((f) => ({ ...f, read: e.target.value }))
          }
          className="px-3 py-2 rounded bg-slate-800"
        >
          <option value="">All</option>
          <option value="true">Read</option>
          <option value="false">Unread</option>
        </select>

        <select
          value={books.filters.rating}
          onChange={(e) =>
            books.setFilters((f) => ({ ...f, rating: e.target.value }))
          }
          className="px-3 py-2 rounded bg-slate-800"
        >
          <option value="">Any rating</option>
          <option value="1">1★+</option>
          <option value="2">2★+</option>
          <option value="3">3★+</option>
          <option value="4">4★+</option>
        </select>

        <select
          value={books.filters.sort}
          onChange={(e) =>
            books.setFilters((f) => ({ ...f, sort: e.target.value }))
          }
          className="px-3 py-2 rounded bg-slate-800"
        >
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
          <option value="author-asc">Author A–Z</option>
          <option value="author-desc">Author Z–A</option>
          <option value="rating-desc">Rating High → Low</option>
          <option value="year-desc">Newest First</option>
          <option value="year-asc">Oldest First</option>
        </select>
      </div>

      <button
        onClick={() => books.setShowAddModal(true)}
        className="px-4 py-2 rounded bg-emerald-600"
      >
        + Add Book
      </button>

      <BookList
        books={books.books}
        onToggleRead={books.toggleRead}
        onEdit={(book) => {
          books.setEditForm(book);
          books.setShowEditModal(true);
        }}
        onDelete={(book) => {
          books.setDeleteTarget(book);
          books.setShowDeleteModal(true);
        }}
        onRate={books.rateBook}
      />

      <AddBookModal
        show={books.showAddModal}
        onClose={() => books.setShowAddModal(false)}
        form={books.addForm}
        setForm={books.setAddForm}
        onSubmit={books.addBook}
      />

      <EditBookModal
        show={books.showEditModal}
        onClose={() => books.setShowEditModal(false)}
        form={books.editForm}
        setForm={books.setEditForm}
        onSubmit={books.saveEdit}
      />

      <DeleteBookModal
        show={books.showDeleteModal}
        onClose={() => books.setShowDeleteModal(false)}
        target={books.deleteTarget}
        onConfirm={books.deleteBook}
      />
    </div>
  );
}
