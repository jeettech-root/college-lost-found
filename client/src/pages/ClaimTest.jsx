import { useState } from 'react';
import api from '../services/api';
import { ShieldCheckIcon, AlertCircleIcon, CheckCircleIcon } from '../components/Icons';

export default function ClaimTest() {
  const [itemId, setItemId] = useState('');
  const [itemType, setItemType] = useState('lost');
  const [message, setMessage] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      const { data } = await api.post('/claims', {
        itemId,
        itemType,
        message,
        proofImage
      });

      setStatus(data);
      setItemId('');
      setMessage('');
      setProofImage('');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-8 shadow-glow backdrop-blur-md">
      <div className="mb-6 flex items-center gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <ShieldCheckIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Claim API Console</h1>
          <p className="text-xs text-slate-400">
            Submit test claims to <code className="rounded bg-[#0B0F17] px-1.5 py-0.5 text-amber-300">POST /api/claims</code>.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Item ID *</label>
            <input
              type="text"
              value={itemId}
              onChange={(event) => setItemId(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              placeholder="e.g. 64b8f... item ID"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Item Type *</label>
            <select
              value={itemType}
              onChange={(event) => setItemType(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-2.5 text-xs text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Claim Message *</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            placeholder="Explain verification details..."
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Proof Image URL</label>
          <input
            type="url"
            value={proofImage}
            onChange={(event) => setProofImage(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            placeholder="Optional proof image URL"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-xs font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Dispatching Endpoint Request...' : 'Submit Claim Request'}
        </button>
      </form>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200">
          <AlertCircleIcon className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <strong className="block font-semibold">Endpoint Error Response</strong>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {status && (
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-200">
          <div className="flex items-center gap-2 font-semibold text-emerald-300">
            <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
            <span>Endpoint Response (200 OK)</span>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-[#0B0F17] p-3 text-[11px] font-mono text-emerald-200">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
