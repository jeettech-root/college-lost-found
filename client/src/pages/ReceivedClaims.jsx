import { useEffect, useState } from 'react';
import api from '../services/api';

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
    return 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200';
  }

  if (status === 'rejected') {
    return 'border-rose-400/20 bg-rose-500/10 text-rose-200';
  }

  return 'border-amber-400/20 bg-amber-500/10 text-amber-200';
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
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur sm:p-8">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
            Owner claim review
          </span>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Review claims for items you own.
          </h1>
          <p className="text-base leading-7 text-slate-300">
            Approve a valid claim to resolve the item, or reject it to keep the item active.
          </p>
        </div>
      </div>

      {message ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center text-slate-300 shadow-glow backdrop-blur">
          Loading received claims...
        </div>
      ) : claims.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-glow backdrop-blur">
          <p className="text-lg font-medium text-white">No claims to review.</p>
          <p className="mt-2 text-sm text-slate-400">When someone claims your items, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {claims.map((claim) => {
            const canAct = claim.status === 'pending' && actionLoadingId === null;
            const isWorking = actionLoadingId === claim._id;

            return (
              <article key={claim._id} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-glow backdrop-blur sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${getStatusStyles(claim.status)}`}>
                      {claim.status}
                    </span>
                    <h2 className="font-display text-2xl font-semibold text-white">{claim.itemTitle || 'Untitled item'}</h2>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{claim.itemType} item</p>
                  </div>

                  <div className="text-right text-xs text-slate-400">
                    <p className="uppercase tracking-[0.2em]">Created</p>
                    <p className="mt-1 text-sm text-slate-300">{formatDate(claim.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Claimer name</p>
                    <p className="mt-1 text-sm text-slate-200">{claim.claimerName || 'Unknown'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Claimer email</p>
                    <p className="mt-1 text-sm text-slate-200 break-all">{claim.claimerEmail || 'Unknown'}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Claim message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">{claim.message}</p>
                </div>

                {claim.proofImage ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
                    <img
                      src={claim.proofImage}
                      alt={`Proof for ${claim.itemTitle || 'claim'}`}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  {claim.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReview(claim._id, 'approved')}
                        disabled={!canAct}
                        className="rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isWorking ? 'Working...' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReview(claim._id, 'rejected')}
                        disabled={!canAct}
                        className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isWorking ? 'Working...' : 'Reject'}
                      </button>
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}