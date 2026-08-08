import { Link } from 'react-router-dom';

const statusClasses = {
  active: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  claimed: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  resolved: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-200'
};

const formatDate = (value) => {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
};

export default function LostItemCard({ item, currentUserId, onDelete }) {
  const ownerId = item.ownerId?._id || item.ownerId;
  const isOwner = Boolean(currentUserId && ownerId && ownerId.toString() === currentUserId.toString());

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/70 shadow-glow backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-300/30">
      <div className="flex items-center justify-center h-52 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800">
        {item.image ? (
          <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
        ) : (
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Lost item</p>
            <h3 className="px-4 text-2xl font-semibold text-white">{item.title}</h3>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-500">{item.category}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${statusClasses[item.status] || statusClasses.active}`}>
            {item.status}
          </span>
        </div>

        <p className="text-sm leading-6 line-clamp-3 text-slate-300">{item.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
          <div className="px-3 py-2 border rounded-2xl border-white/10 bg-white/5">
            <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Location</span>
            <span className="block mt-1">{item.location}</span>
          </div>
          <div className="px-3 py-2 border rounded-2xl border-white/10 bg-white/5">
            <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Date lost</span>
            <span className="block mt-1">{formatDate(item.dateLost)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1 text-sm text-slate-400">
          <span>Reward: {item.reward ? `$${item.reward}` : 'No reward'}</span>
          <Link to={`/lost/${item._id}`} className="font-medium transition text-amber-200 hover:text-amber-100">
            View details
          </Link>
        </div>

        {isOwner ? (
          <div className="flex gap-3 pt-2">
            <Link
              to={`/lost/${item._id}/edit`}
              className="flex-1 px-4 py-3 text-sm font-medium text-center transition border rounded-2xl border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => onDelete(item._id)}
              className="flex-1 px-4 py-3 text-sm font-medium transition border rounded-2xl border-rose-400/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}