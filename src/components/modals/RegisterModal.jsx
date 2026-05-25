"use client";

export default function RegisterModal({
  show,
  onClose,
  form,
  setForm,
  onSubmit,
  error,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-full max-w-sm border border-slate-700">
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        {error && <p className="text-sm text-rose-400 mb-2">{error}</p>}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm((f) => ({ ...f, username: e.target.value }))
            }
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
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
            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
