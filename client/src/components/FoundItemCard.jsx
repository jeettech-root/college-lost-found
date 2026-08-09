import { Link } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, TagIcon, EditIcon, TrashIcon, ImageIcon } from './Icons';

const statusClasses = {
  active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  claimed: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  resolved: 'border-sky-500/30 bg-sky-500/10 text-sky-300'
};

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
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111726]/90 shadow-glow backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-sky-500/30 hover:shadow-cyan-subtle">
      {/* Image Frame / Pattern Placeholder */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sky-950/40 via-[#111726] to-slate-900 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
              <ImageIcon className="h-6 w-6" />
            </div>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-sky-400/80">Found Item Report</p>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-xl border border-sky-500/30 bg-[#0B0F17]/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-300 backdrop-blur-md">
            Found
          </span>
        </div>

        <div className="absolute right-3 top-3">
          <span
            className={`rounded-xl border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md ${statusClasses[item.status] || statusClasses.active
              }`}
          >
            {item.status}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <TagIcon className="h-3 w-3 text-slate-400" />
              {item.category}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-bold text-white transition group-hover:text-sky-300 line-clamp-1">
            {item.title}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">{item.description}</p>
        </div>

        {/* Location & Date Pills */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
            <MapPinIcon className="h-4 w-4 shrink-0 text-sky-400" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
            <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{formatDate(item.dateFound)}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2">
          <div className="flex items-center gap-2">
            <Link
              to={`/found/${item._id}`}
              className="flex-1 rounded-xl bg-sky-400 px-4 py-2.5 text-center text-xs font-bold text-slate-950 transition hover:bg-sky-300 shadow-cyan-subtle"
            >
              View Details
            </Link>

            {isOwner ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/found/${item._id}/edit`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  title="Edit item"
                >
                  <EditIcon className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(item._id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                  title="Delete item"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}