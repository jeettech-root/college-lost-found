import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import FoundItemCard from '../components/FoundItemCard';
import { SearchIcon, FilterIcon, MapPinIcon, PlusIcon, SparklesIcon, AlertCircleIcon, TagIcon } from '../components/Icons';

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
    <section className="space-y-8 pb-12">
      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-6 shadow-glow backdrop-blur-md sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
              <TagIcon className="h-3.5 w-3.5" />
              Found Item Registry
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Browse & return found items.
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Explore items recovered across campus grounds. Search by keyword, filter by building location or status, and verify ownership.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-center">
              <span className="block font-display text-xl font-bold text-sky-400">{items.length}</span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Found</span>
            </div>

            <Link
              to="/found/new"
              className="flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-cyan-subtle transition hover:bg-sky-300"
            >
              <PlusIcon className="h-4 w-4" />
              Report Found Item
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Filter Panel */}
      <form onSubmit={handleSearch} className="rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-5 shadow-glow backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <FilterIcon className="h-4 w-4 text-sky-400" />
            <span>Search & Filter Directory</span>
          </div>
          <span className="text-[11px] text-slate-500">Live Campus Index</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <SearchIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Title, category, description..."
              className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              placeholder="Category (e.g. Wallet, Keys)"
              className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <MapPinIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location (e.g. Library)"
              className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>

          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-3.5 py-2.5 text-xs text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            >
              <option value="">All Statuses</option>
              <option value="active">Active (Available)</option>
              <option value="claimed">Claimed (Pending)</option>
              <option value="resolved">Resolved (Returned)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/[0.06] pt-3">
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Reset Filters
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-sky-400 px-5 py-2 text-xs font-bold text-slate-950 shadow-cyan-subtle transition hover:bg-sky-300"
          >
            <SearchIcon className="h-3.5 w-3.5" />
            Apply Filters
          </button>
        </div>
      </form>

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          <AlertCircleIcon className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Main Content Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="h-96 animate-pulse rounded-3xl border border-white/[0.06] bg-[#111726]/40 p-5 space-y-4">
              <div className="h-48 w-full rounded-2xl bg-white/5" />
              <div className="h-6 w-3/4 rounded-lg bg-white/5" />
              <div className="h-4 w-1/2 rounded-lg bg-white/5" />
              <div className="h-10 w-full rounded-xl bg-white/5" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-[#111726]/70 px-6 py-16 text-center shadow-glow backdrop-blur-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
            <SparklesIcon className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">No found items match your query</h3>
          <p className="mt-2 max-w-sm text-xs text-slate-400">
            Try adjusting your search terms or filter criteria, or declare a new found item.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              Clear Filters
            </button>
            <Link
              to="/found/new"
              className="flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-sky-300 shadow-cyan-subtle"
            >
              <PlusIcon className="h-4 w-4" />
              Report Found Item
            </Link>
          </div>
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