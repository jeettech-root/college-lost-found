import { useEffect, useState } from 'react';
import { TagIcon, MapPinIcon, CalendarIcon, ImageIcon, CheckCircleIcon } from './Icons';

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
    <section className="mx-auto max-w-3xl rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-6 shadow-glow backdrop-blur-md sm:p-10">
      <div className="mb-8 border-b border-white/[0.08] pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
          <TagIcon className="h-3.5 w-3.5" />
          Found Item Declaration
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{subtitle}</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Section 1: Item Details */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">1. Basic Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-slate-300">Item Title *</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                placeholder="e.g. Blue Hydro Flask Bottle"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-slate-300">Category *</span>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                placeholder="e.g. Water Bottle, Keys, Headphones"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-300">Description *</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Describe clear features so the rightful owner can verify ownership..."
              required
            />
          </label>
        </div>

        {/* Section 2: Location & Date */}
        <div className="space-y-4 pt-2 border-t border-white/[0.06]">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">2. Location & Date Found</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-300">
                <MapPinIcon className="h-3.5 w-3.5 text-sky-400" />
                Where Was It Found? *
              </span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                placeholder="e.g. Science Building Hallway"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-300">
                <CalendarIcon className="h-3.5 w-3.5 text-sky-400" />
                Date Found *
              </span>
              <input
                type="date"
                name="dateFound"
                value={formData.dateFound}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                required
              />
            </label>
          </div>
        </div>

        {/* Section 3: Media & Status */}
        <div className="space-y-4 pt-2 border-t border-white/[0.06]">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">3. Photo & Status</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-300">
                <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                Image URL (optional)
              </span>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                placeholder="https://images.unsplash.com/..."
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-slate-300">Status</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              >
                <option value="active">Active (Available for Claim)</option>
                <option value="claimed">Claimed (Claim Pending)</option>
                <option value="resolved">Resolved (Restored to Owner)</option>
              </select>
            </label>
          </div>

          {/* Live Image Preview Box */}
          {formData.image ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F17] p-2">
              <p className="mb-2 text-[11px] font-semibold text-slate-400 px-2">Image Preview:</p>
              <img
                src={formData.image}
                alt="Preview"
                className="h-40 w-full rounded-xl object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-cyan-subtle transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              <span>Saving Report...</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-5 w-5" />
              <span>{submitLabel}</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}