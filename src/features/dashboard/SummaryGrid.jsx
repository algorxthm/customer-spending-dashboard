import Card from "../../components/Card";
import { useSpendingSummary } from "../../api/queries";

function moneyZAR(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
}

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export default function SummaryGrid({ customerId, period }) {
  const { data, isLoading, error } = useSpendingSummary(customerId, period);

  return (
    <Card title="Summary" right={<div className="text-xs text-slate-500">Period: {period}</div>}>
      {isLoading && <div className="text-sm text-slate-500">Loading summary…</div>}
      {error && <div className="text-sm text-red-600">{String(error.message || error)}</div>}

      {data && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            label="Total spent"
            value={moneyZAR(data.totalSpent)}
            sub={`${data.comparedToPrevious?.spentChange ?? 0}% vs previous`}
          />
          <Stat
            label="Transactions"
            value={String(data.transactionCount ?? "—")}
            sub={`${data.comparedToPrevious?.transactionChange ?? 0}% vs previous`}
          />
          <Stat
            label="Avg transaction"
            value={moneyZAR(data.averageTransaction)}
            sub={`Top category: ${data.topCategory || "—"}`}
          />
        </div>
      )}
    </Card>
  );
}
