import { Link } from 'react-router-dom';

const formatDate = (value) => {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
};

export default function FoundItemCard({ item, currentUserId, onDelete }) {
  const ownerId = item?.finderId?._id || item?.finderId;
  const isOwner = Boolean(currentUserId && ownerId && ownerId.toString() === currentUserId.toString());

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-glow backdrop-blur transition hover:-translate-y-1 hover:border-white/20">
      <div className="relative aspect-[16/10] bg-gradient-to-br from-cyan-500/20 via-slate-950 to-slate-900">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Found item</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
            </div>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-200">
          {item.status}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-500">{item.category}</p>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{item.description}</p>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Location</p>
            <p className="mt-1 text-slate-200">{item.location}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Date found</p>
            <p className="mt-1 text-slate-200">{formatDate(item.dateFound)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/found/${item._id}`}
            className="rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            View details
          </Link>
          {isOwner ? (
            <>
              <Link
                to={`/found/${item._id}/edit`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onDelete(item._id)}
                className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}