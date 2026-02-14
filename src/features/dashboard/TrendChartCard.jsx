import { useMemo, useState } from "react";
import Card from "../../components/Card";
import { useSpendingTrends } from "../../api/queries";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

function moneyZAR(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
}

function monthLabel(yyyyMm) {
  const [y, m] = yyyyMm.split("-").map(Number);
  const d = new Date(y, (m || 1) - 1, 1);
  return d.toLocaleString("en-ZA", { month: "short" });
}

function CustomTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <div className="font-semibold text-slate-900">{label}</div>
      {metric === "spent" ? (
        <div className="text-slate-600">{moneyZAR(p.totalSpent)}</div>
      ) : (
        <div className="text-slate-600">{p.transactionCount} txns</div>
      )}
      <div className="text-slate-500">Avg: {moneyZAR(p.averageTransaction)}</div>
    </div>
  );
}

export default function TrendChartCard({ customerId }) {
  const [metric, setMetric] = useState("spent"); // spent | count
  const [months, setMonths] = useState(12);

  const { data, isLoading, error } = useSpendingTrends(customerId, months);

  const chartData = useMemo(() => {
    const trends = data?.trends ?? [];
    return trends.map((t) => ({ ...t, label: monthLabel(t.month) }));
  }, [data]);

  return (
    <Card
      title="Monthly Trends"
      right={
        <div className="flex items-center gap-2">
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="h-8 rounded-xl border border-slate-200 bg-white px-2 text-xs"
          >
            <option value="spent">Total spent</option>
            <option value="count">Transaction count</option>
          </select>

          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="h-8 rounded-xl border border-slate-200 bg-white px-2 text-xs"
          >
            {[6, 12, 18, 24].map((m) => (
              <option key={m} value={m}>
                {m}m
              </option>
            ))}
          </select>
        </div>
      }
    >
      {isLoading && <div className="text-sm text-slate-500">Loading trends…</div>}
      {error && <div className="text-sm text-red-600">{String(error.message || error)}</div>}

      {data && (
        <div className="h-64 rounded-2xl bg-slate-50 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (metric === "spent" ? `R${Math.round(v)}` : `${v}`)}
              />
              <Tooltip content={<CustomTooltip metric={metric} />} />
              <Line
                type="monotone"
                dataKey={metric === "spent" ? "totalSpent" : "transactionCount"}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
