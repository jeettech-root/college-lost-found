import { useState } from 'react';
import api from '../services/api';
import { ShieldCheckIcon, ImageIcon, AlertCircleIcon, CheckCircleIcon } from './Icons';

export default function ClaimForm({ itemId, itemType, onSuccess }) {
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
      setMessage('');
      setProofImage('');
      if (typeof onSuccess === 'function') {
        onSuccess(data);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-6 shadow-glow backdrop-blur-md sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <ShieldCheckIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">File Ownership Claim</h2>
          <p className="text-xs text-slate-400">
            Submit details verifying this item belongs to you. The reporter will be notified.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300">
            Proof of Ownership / Explanation *
          </label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            required
            className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            placeholder="Provide specific identifying details (serial number, distinctive marks, contents, purchase date)..."
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <ImageIcon className="h-4 w-4 text-slate-400" />
            Proof Image URL (optional)
          </label>
          <input
            type="url"
            value={proofImage}
            onChange={(event) => setProofImage(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {proofImage ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F17] p-2">
            <p className="mb-2 text-[11px] font-semibold text-slate-400 px-2">Proof Image Preview:</p>
            <img
              src={proofImage}
              alt="Proof preview"
              className="h-36 w-full rounded-xl object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-amber-subtle transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              <span>Submitting Claim...</span>
            </>
          ) : (
            <span>Submit Verification Claim</span>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          <AlertCircleIcon className="h-5 w-5 shrink-0 text-rose-400" />
          <div>
            <strong className="block font-semibold">Submission Failed</strong>
            <p className="mt-0.5 text-xs text-rose-300">{error}</p>
          </div>
        </div>
      )}

      {status && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <strong className="block font-semibold">Claim Submitted Successfully</strong>
            <p className="mt-0.5 text-xs text-emerald-300">
              The reporter will review your claim details. You can track progress under your account.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
