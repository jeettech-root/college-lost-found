import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ClaimForm from '../components/ClaimForm';
import { MapPinIcon, CalendarIcon, DollarSignIcon, TagIcon, UserIcon, ArrowLeftIcon, EditIcon, TrashIcon, ImageIcon, ShieldCheckIcon } from '../components/Icons';

const formatDate = (value) => {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
};

export default function LostItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ownerId = item?.ownerId?._id || item?.ownerId;
  const isOwner = Boolean(user?._id && ownerId && ownerId.toString() === user._id.toString());
  const [showClaimForm, setShowClaimForm] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get(`/lost/${id}`);
        setItem(data.item);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load lost item');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this lost item?');

    if (!confirmed) return;

    try {
      await api.delete(`/lost/${id}`);
      navigate('/lost');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete lost item');
    }
  };

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-3xl border border-white/[0.08] bg-[#111726]/80 backdrop-blur-md">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <span>Loading item details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">
        <p className="font-semibold text-lg">{error}</p>
        <Link to="/lost" className="inline-flex items-center gap-2 rounded-xl bg-rose-400 px-4 py-2 text-xs font-bold text-slate-950">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Lost Items Directory
        </Link>
      </div>
    );
  }

  if (!item) return null;

  return (
    <section className="space-y-8 pb-12">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/lost"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Lost Registry
        </Link>

        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Lost Item Report #{item._id.slice(-6)}
        </span>
      </div>

      {/* Main Split Details Card */}
      <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111726]/90 shadow-glow backdrop-blur-md">
        <div className="grid gap-0 lg:grid-cols-12">
          {/* Left Column: Image or Rich Vector Frame */}
          <div className="relative flex min-h-[340px] items-center justify-center bg-slate-900 lg:col-span-6 border-b border-white/10 lg:border-b-0 lg:border-r">
            {item.image ? (
              <img src={item.image} alt={item.title} className="h-full w-full object-cover max-h-[500px]" />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-amber-400">No Image Uploaded</p>
                <h2 className="mt-1 text-2xl font-bold text-white max-w-sm">{item.title}</h2>
              </div>
            )}
          </div>

          {/* Right Column: Information Panel */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <TagIcon className="h-3.5 w-3.5 text-slate-400" />
                  {item.category}
                </span>

                <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Status: {item.status}
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {item.title}
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">{item.description}</p>
            </div>

            {/* Metadata Cards Grid */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0B0F17] p-3.5">
                <span className="flex items-center gap-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  <MapPinIcon className="h-3.5 w-3.5 text-amber-400" />
                  Location Lost
                </span>
                <p className="mt-1 font-bold text-white text-sm truncate">{item.location}</p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-[#0B0F17] p-3.5">
                <span className="flex items-center gap-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                  Date Lost
                </span>
                <p className="mt-1 font-bold text-white text-sm truncate">{formatDate(item.dateLost)}</p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-[#0B0F17] p-3.5">
                <span className="flex items-center gap-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  <DollarSignIcon className="h-3.5 w-3.5 text-amber-400" />
                  Reward
                </span>
                <p className="mt-1 font-bold text-amber-300 text-sm truncate">
                  {item.reward ? `$${item.reward}` : 'No reward listed'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-[#0B0F17] p-3.5">
                <span className="flex items-center gap-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  Reported By
                </span>
                <p className="mt-1 font-bold text-white text-sm truncate">{item.ownerId?.name || 'Anonymous User'}</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-white/[0.08]">
              <div className="flex flex-wrap gap-3">
                {isOwner ? (
                  <>
                    <Link
                      to={`/lost/${item._id}/edit`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-amber-300 shadow-amber-subtle"
                    >
                      <EditIcon className="h-4 w-4" />
                      Edit Declaration
                    </Link>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete Report
                    </button>
                  </>
                ) : null}

                {!isOwner && user && item.status !== 'resolved' ? (
                  <button
                    type="button"
                    onClick={() => setShowClaimForm((value) => !value)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold text-slate-950 shadow-amber-subtle transition hover:bg-amber-300"
                  >
                    <ShieldCheckIcon className="h-4 w-4" />
                    {showClaimForm ? 'Hide Claim Form' : 'Submit Ownership Claim'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Form Drawer */}
      {showClaimForm && (
        <div className="mt-6">
          <ClaimForm itemId={item._id} itemType="lost" onSuccess={() => setShowClaimForm(false)} />
        </div>
      )}
    </section>
  );
}