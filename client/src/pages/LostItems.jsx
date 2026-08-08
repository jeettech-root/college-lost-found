import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LostItemCard from '../components/LostItemCard';

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
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
              Lost item module
            </span>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Track the things you lost on campus.
            </h1>
            <p className="text-base leading-7 text-slate-300">
              Add a lost item, review its status, and keep ownership tied to your account.
            </p>
          </div>

          <Link
            to="/lost/new"
            className="inline-flex items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            Report lost item
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center text-slate-300 shadow-glow backdrop-blur">
          Loading lost items...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-glow backdrop-blur">
          <p className="text-lg font-medium text-white">No lost items yet.</p>
          <p className="mt-2 text-sm text-slate-400">Create the first report to get started.</p>
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