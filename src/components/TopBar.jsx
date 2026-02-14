import Logo from "./Logo";
export default function TopBar({
  customerId,
  setCustomerId,
  period,
  setPeriod,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onRefresh,
}) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
       <Logo/>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="12345">Customer 12345</option>
            <option value="67890">Customer 67890</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          />
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          />

          <button
            onClick={onRefresh}
            className="h-9 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
