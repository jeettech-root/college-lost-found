import { useState } from 'react';
import api from '../services/api';

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
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-glow">
      <h2 className="mb-4 text-xl font-semibold text-amber-200">Claim this item</h2>
      <p className="mb-6 text-sm text-slate-300">
        Submit a claim and the owner/finder will be able to review it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Message</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            placeholder="Explain why you are claiming this item"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Proof image URL (optional)</label>
          <input
            type="url"
            value={proofImage}
            onChange={(event) => setProofImage(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            placeholder="Add an image URL that supports your claim"
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
          <strong className="block font-semibold">Claim sent</strong>
          <p className="mt-2">Your claim has been submitted successfully.</p>
        </div>
      )}
    </div>
  );
}
