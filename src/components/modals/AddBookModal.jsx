"use client";

export default function AddBookModal({
  show,
  onClose,
  form,
  setForm,
  onSubmit,
}) {
  if (!show) return null;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md border border-slate-700">
        <h2 className="text-xl font-semibold mb-4">Add Book</h2>

        <div className="grid grid-cols-1 gap-3">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          />

          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          />

          <input
            placeholder="Genre"
            value={form.genre}
            onChange={(e) => update("genre", e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          />

          <input
            placeholder="Published Year"
            value={form.publishedYear}
            onChange={(e) => update("publishedYear", e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          />

          <input
            placeholder="Cover Image URL"
            value={form.coverImageUrl}
            onChange={(e) => update("coverImageUrl", e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          />

          <input
            placeholder="Purchase Link"
            value={form.purchaseLink}
            onChange={(e) => update("purchaseLink", e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          />

          <input
            placeholder="Read Online Link"
            value={form.readOnlineLink}
            onChange={(e) => update("readOnlineLink", e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          />

          <textarea
            placeholder="Summary"
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700 h-24"
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}
