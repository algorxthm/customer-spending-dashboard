export default function Pagination({ total, limit, offset, onPrev, onNext, hasMore }) {
  const from = Math.min(total, offset + 1);
  const to = Math.min(total, offset + limit);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-900">{from}</span>–{" "}
        <span className="font-medium text-slate-900">{to}</span> of{" "}
        <span className="font-medium text-slate-900">{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={offset === 0}
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={!hasMore}
          className="h-9 rounded-xl bg-slate-900 px-3 text-sm text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
