import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import FoundItemCard from '../components/FoundItemCard';

const defaultFilters = {
  search: '',
  category: '',
  location: '',
  status: ''
};

export default function FoundItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = async (activeFilters = filters) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();

      if (activeFilters.search) params.set('search', activeFilters.search);
      if (activeFilters.category) params.set('category', activeFilters.category);
      if (activeFilters.location) params.set('location', activeFilters.location);
      if (activeFilters.status) params.set('status', activeFilters.status);

      const query = params.toString();
      const { data } = await api.get(`/found${query ? `?${query}` : ''}`);
      setItems(data.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load found items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems(defaultFilters);
  }, []);

  const handleFilterChange = (event) => {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadItems(filters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    loadItems(defaultFilters);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this found item?');

    if (!confirmed) return;

    try {
      await api.delete(`/found/${id}`);
      setItems((current) => current.filter((item) => item._id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete found item');
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
              Found item module
            </span>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Share and search items found on campus.
            </h1>
            <p className="text-base leading-7 text-slate-300">
              Add found items, search by title or category, and filter by location or status.
            </p>
          </div>

          <Link
            to="/found/new"
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Add found item
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur lg:grid-cols-4">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search title, category, description..."
          className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
        />
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          placeholder="Category"
          className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
        />
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Location"
          className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="claimed">Claimed</option>
          <option value="resolved">Resolved</option>
        </select>

        <div className="flex gap-3 lg:col-span-4">
          <button
            type="submit"
            className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Search
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Reset
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center text-slate-300 shadow-glow backdrop-blur">
          Loading found items...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-glow backdrop-blur">
          <p className="text-lg font-medium text-white">No found items yet.</p>
          <p className="mt-2 text-sm text-slate-400">Create the first found item or loosen your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <FoundItemCard key={item._id} item={item} currentUserId={user?._id} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}