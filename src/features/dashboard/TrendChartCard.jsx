import { useMemo, useState } from "react";
import Card from "../../components/Card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Mock data shaped like GET /spending/trends :contentReference[oaicite:2]{index=2}
const mockTrendsResponse = {
  trends: [
    { month: "2024-01", totalSpent: 3890.25, transactionCount: 42, averageTransaction: 92.62 },
    { month: "2024-02", totalSpent: 4150.8, transactionCount: 38, averageTransaction: 109.23 },
    { month: "2024-03", totalSpent: 3750.6, transactionCount: 45, averageTransaction: 83.35 },
    { month: "2024-04", totalSpent: 4200.45, transactionCount: 39, averageTransaction: 107.7 },
    { month: "2024-05", totalSpent: 3980.3, transactionCount: 44, averageTransaction: 90.46 },
    { month: "2024-06", totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44 },
  ],
};

function money(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
}

function monthLabel(yyyyMm) {
  // "2024-06" -> "Jun"
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
        <div className="text-slate-600">{money(p.totalSpent)}</div>
      ) : (
        <div className="text-slate-600">{p.transactionCount} txns</div>
      )}
      <div className="text-slate-500">Avg: {money(p.averageTransaction)}</div>
    </div>
  );
}

export default function TrendChartCard() {
  const [metric, setMetric] = useState("spent"); // spent | count

  const chartData = useMemo(() => {
    return mockTrendsResponse.trends.map((t) => ({
      ...t,
      label: monthLabel(t.month),
    }));
  }, []);

  return (
    <Card
      title="Monthly Trends"
      right={
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="h-8 rounded-xl border border-slate-200 bg-white px-2 text-xs"
        >
          <option value="spent">Total spent</option>
          <option value="count">Transaction count</option>
        </select>
      }
    >
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
    </Card>
  );
}
