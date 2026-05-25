"use client";

export default function DeleteBookModal({ show, onClose, target, onConfirm }) {
  if (!show || !target) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-full max-w-sm border border-slate-700">
        <h2 className="text-xl font-semibold mb-4">Delete Book</h2>

        <p className="text-slate-300 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{target.title}</span>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
