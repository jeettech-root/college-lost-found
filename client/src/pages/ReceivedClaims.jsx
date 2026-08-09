import { useEffect, useState } from 'react';
import api from '../services/api';
import { InboxIcon, CheckCircleIcon, XIcon, UserIcon, MailIcon, ImageIcon, AlertCircleIcon } from '../components/Icons';

const formatDate = (value) => {
  if (!value) return 'Unknown';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
};

const getStatusStyles = (status) => {
  if (status === 'approved') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  }

  if (status === 'rejected') {
    return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
  }

  return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
};

export default function ReceivedClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadClaims = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/claims/received');
      setClaims(data.claims || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load received claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleReview = async (claimId, status) => {
    setActionLoadingId(claimId);
    setMessage('');
    setError('');

    try {
      const { data } = await api.put(`/claims/${claimId}`, { status });
      setMessage(data.message || `Claim ${status} successfully`);
      await loadClaims();
    } catch (requestError) {
      setError(requestError.response?.data?.message || `Unable to ${status} claim`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-6 shadow-glow backdrop-blur-md sm:p-10">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
            <InboxIcon className="h-3.5 w-3.5" />
            Verification Control Center
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Review incoming ownership claims.
          </h1>
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            Evaluate claim details and proof images submitted by users. Approving a claim marks the item as resolved and restores ownership.
          </p>
        </div>
      </div>

      {message ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          <AlertCircleIcon className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      ) : null}

      {loading ? (
        <div className="flex h-80 items-center justify-center rounded-3xl border border-white/[0.08] bg-[#111726]/80 backdrop-blur-md">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
            <span>Loading received claims...</span>
          </div>
        </div>
      ) : claims.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-[#111726]/70 px-6 py-16 text-center shadow-glow backdrop-blur-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
            <InboxIcon className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">No incoming claims to review</h3>
          <p className="mt-2 max-w-sm text-xs text-slate-400">
            When campus members file claims for items you declared, they will appear here for verification.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {claims.map((claim) => {
            const canAct = claim.status === 'pending' && actionLoadingId === null;
            const isWorking = actionLoadingId === claim._id;

            return (
              <article
                key={claim._id}
                className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-6 shadow-glow backdrop-blur-md"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-xl border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${getStatusStyles(claim.status)}`}>
                          {claim.status}
                        </span>
                        <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {claim.itemType} Item
                        </span>
                      </div>
                      <h2 className="font-display text-xl font-bold text-white mt-2">{claim.itemTitle || 'Untitled Item'}</h2>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      <span className="block font-semibold uppercase tracking-wider text-slate-500">Submitted</span>
                      <span className="block mt-0.5 text-slate-300 font-medium">{formatDate(claim.createdAt)}</span>
                    </div>
                  </div>

                  {/* Claimer Information Pills */}
                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-[#0B0F17] p-3">
                      <UserIcon className="h-4 w-4 shrink-0 text-sky-400" />
                      <div className="truncate">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Claimer</span>
                        <span className="block font-bold text-white truncate">{claim.claimerName || 'Unknown'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-[#0B0F17] p-3">
                      <MailIcon className="h-4 w-4 shrink-0 text-sky-400" />
                      <div className="truncate">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Contact Email</span>
                        <span className="block font-bold text-white truncate">{claim.claimerEmail || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Claim Message */}
                  <div className="rounded-2xl border border-white/[0.06] bg-[#0B0F17] p-4 text-xs">
                    <span className="block font-semibold uppercase tracking-wider text-slate-400 text-[10px]">Verification Message</span>
                    <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-200">{claim.message}</p>
                  </div>

                  {/* Proof Image Box */}
                  {claim.proofImage ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F17]">
                      <div className="p-2.5 border-b border-white/[0.06] flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <ImageIcon className="h-4 w-4 text-sky-400" />
                        <span>Submitted Proof Photo</span>
                      </div>
                      <img
                        src={claim.proofImage}
                        alt={`Proof for ${claim.itemTitle || 'claim'}`}
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Review Action Controls */}
                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                  {claim.status === 'pending' ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleReview(claim._id, 'approved')}
                        disabled={!canAct}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isWorking ? 'Processing...' : 'Approve & Mark Resolved'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReview(claim._id, 'rejected')}
                        disabled={!canAct}
                        className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isWorking ? 'Processing...' : 'Reject Claim'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs text-slate-400">
                      This claim has been processed as <strong className="uppercase text-white">{claim.status}</strong>.
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}