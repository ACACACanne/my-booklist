"use client";

import { useState, useEffect, useCallback } from "react";

export default function useBooks(token) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters (will be controlled by useFilters)
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    read: "",
    rating: "",
    sort: "title-asc",
  });

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Forms
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

  // Fetch books
  const fetchBooks = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.genre) params.append("genre", filters.genre);
      if (filters.read) params.append("read", filters.read);
      if (filters.rating) params.append("minRating", filters.rating);

      const res = await fetch(`/api/books?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Sorting
      const sorted = [...data].sort((a, b) => {
        switch (filters.sort) {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // PATCH helper
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
      if (!res.ok) throw new Error(data.message);

      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  // Actions
  const toggleRead = (book) => patchBook(book._id, "readStatus");
  const rateBook = (book, rating) => patchBook(book._id, "rating", { rating });

  // Add
  const addBook = async () => {
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
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit
  const saveEdit = async () => {
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
  };

  // Delete
  const deleteBook = async () => {
    try {
      const res = await fetch(`/api/books/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    books,
    loading,
    error,

    filters,
    setFilters,

    showAddModal,
    showEditModal,
    showDeleteModal,

    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,

    addForm,
    editForm,
    deleteTarget,

    setAddForm,
    setEditForm,
    setDeleteTarget,

    fetchBooks,
    toggleRead,
    rateBook,
    addBook,
    saveEdit,
    deleteBook,
  };
}
