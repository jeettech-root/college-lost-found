import { useEffect, useState } from 'react';

const defaultForm = {
  title: '',
  category: '',
  description: '',
  location: '',
  dateFound: '',
  image: '',
  status: 'active'
};

export default function FoundItemForm({ initialValues, onSubmit, submitting, submitLabel, title, subtitle }) {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (!initialValues) {
      setFormData(defaultForm);
      return;
    }

    setFormData({
      title: initialValues.title || '',
      category: initialValues.category || '',
      description: initialValues.description || '',
      location: initialValues.location || '',
      dateFound: initialValues.dateFound ? new Date(initialValues.dateFound).toISOString().slice(0, 10) : '',
      image: initialValues.image || '',
      status: initialValues.status || 'active'
    });
  }, [initialValues]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur sm:p-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Title</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="Black wallet"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Category</span>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="Wallet, ID Card, Electronics"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
            placeholder="Describe the found item clearly so the owner can identify it."
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Location</span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="Library, cafeteria, lecture hall"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Date found</span>
            <input
              type="date"
              name="dateFound"
              value={formData.dateFound}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Image URL</span>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="https://..."
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            >
              <option value="active">Active</option>
              <option value="claimed">Claimed</option>
              <option value="resolved">Resolved</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </form>
    </section>
  );
}