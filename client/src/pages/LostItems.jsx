import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LostItemCard from '../components/LostItemCard';
import { PlusIcon, AlertCircleIcon, TagIcon, SparklesIcon } from '../components/Icons';

export default function LostItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/lost');
      setItems(data.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load lost items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this lost item?');

    if (!confirmed) return;

    try {
      await api.delete(`/lost/${id}`);
      setItems((current) => current.filter((item) => item._id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete lost item');
    }
  };

  return (
    <section className="space-y-8 pb-12">
      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-6 shadow-glow backdrop-blur-md sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
              <TagIcon className="h-3.5 w-3.5" />
              Lost Item Registry
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Track & recover lost belongings.
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Browse lost item declarations posted by students and faculty. Filter status, review details, or submit a claim.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-center">
              <span className="block font-display text-xl font-bold text-amber-400">{items.length}</span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Lost</span>
            </div>

            <Link
              to="/lost/new"
              className="flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-amber-subtle transition hover:bg-amber-300"
            >
              <PlusIcon className="h-4 w-4" />
              Report Lost Item
            </Link>
          </div>
        </div>
      </div>

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
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <SparklesIcon className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">No lost items listed yet</h3>
          <p className="mt-2 max-w-sm text-xs text-slate-400">
            It looks like there are no active lost item reports right now. Create the first report to alert the campus community.
          </p>
          <Link
            to="/lost/new"
            className="mt-6 flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-300 shadow-amber-subtle"
          >
            <PlusIcon className="h-4 w-4" />
            Create Lost Item Report
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <LostItemCard key={item._id} item={item} currentUserId={user?._id} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}