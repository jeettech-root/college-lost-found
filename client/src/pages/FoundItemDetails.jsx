import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatDate = (value) => {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
};

export default function FoundItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ownerId = item?.finderId?._id || item?.finderId;
  const isOwner = Boolean(user?._id && ownerId && ownerId.toString() === user._id.toString());

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get(`/found/${id}`);
        setItem(data.item);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load found item');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this found item?');

    if (!confirmed) return;

    try {
      await api.delete(`/found/${id}`);
      navigate('/found');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete found item');
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center text-slate-300 shadow-glow backdrop-blur">
        Loading item details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-6 text-rose-200">
        <p>{error}</p>
        <Link to="/found" className="inline-flex rounded-2xl bg-rose-200 px-4 py-2 font-medium text-rose-950">
          Back to found items
        </Link>
      </div>
    );
  }

  if (!item) return null;

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-glow backdrop-blur">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-cyan-500/20 via-slate-950 to-slate-800 p-6">
            {item.image ? (
              <img src={item.image} alt={item.title} className="max-h-[420px] w-full rounded-[1.5rem] object-cover" />
            ) : (
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Found item</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">{item.title}</h1>
              </div>
            )}
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
                  Found item details
                </span>
                <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">{item.title}</h1>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">{item.category}</p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
                {item.status}
              </span>
            </div>

            <p className="text-sm leading-7 text-slate-300">{item.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Location</p>
                <p className="mt-1 text-sm text-slate-200">{item.location}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Date found</p>
                <p className="mt-1 text-sm text-slate-200">{formatDate(item.dateFound)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Finder</p>
                <p className="mt-1 text-sm text-slate-200">{item.finderId?.name || 'You'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/found"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                Back to list
              </Link>
              {isOwner ? (
                <>
                  <Link
                    to={`/found/${item._id}/edit`}
                    className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                  >
                    Edit item
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
                  >
                    Delete item
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}