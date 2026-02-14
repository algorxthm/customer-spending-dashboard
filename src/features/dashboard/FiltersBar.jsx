export default function FiltersBar({ category, setCategory, sortBy, setSortBy, limit, setLimit, onReset }) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
        >
          <option value="">All categories</option>
          <option value="Groceries">Groceries</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Transportation">Transportation</option>
          <option value="Dining">Dining</option>
          <option value="Shopping">Shopping</option>
          <option value="Utilities">Utilities</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
        >
          <option value="date_desc">Date (newest)</option>
          <option value="date_asc">Date (oldest)</option>
          <option value="amount_desc">Amount (high → low)</option>
          <option value="amount_asc">Amount (low → high)</option>
        </select>

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              Rows: {n}
            </option>
          ))}
        </select>

        <button
          onClick={onReset}
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
