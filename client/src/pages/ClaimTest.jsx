import { useState } from 'react';
import api from '../services/api';

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
    <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-glow">
      <h1 className="mb-6 text-3xl font-semibold text-amber-200">Claim API Test</h1>
      <p className="mb-6 text-sm text-slate-300">
        Use this page to submit a claim against a lost or found item. The request is sent to <code className="rounded bg-slate-800 px-1 py-0.5">POST /api/claims</code>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Item ID</label>
          <input
            type="text"
            value={itemId}
            onChange={(event) => setItemId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            placeholder="Enter lost or found item ID"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Item Type</label>
          <select
            value={itemType}
            onChange={(event) => setItemType(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Message</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            placeholder="Explain why this item should be claimed"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Proof Image URL</label>
          <input
            type="url"
            value={proofImage}
            onChange={(event) => setProofImage(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            placeholder="Optional image or screenshot URL"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Claim'}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-4 text-sm text-rose-100">
          <strong className="block font-semibold">Error</strong>
          <p>{error}</p>
        </div>
      )}

      {status && (
        <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
          <strong className="block font-semibold">Success</strong>
          <pre className="mt-2 overflow-x-auto text-xs text-slate-200">{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
