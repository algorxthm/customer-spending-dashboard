import Card from "../../components/Card";
import { useSpendingCategories } from "../../api/queries";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

function moneyZAR(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <div className="font-semibold text-slate-900">{p.name}</div>
      <div className="text-slate-600">{moneyZAR(p.amount)}</div>
      <div className="text-slate-500">{p.percentage}%</div>
    </div>
  );
}

export default function CategoryChartCard({
  customerId,
  period,
  dateParams,
  selectedCategory,
  onSelectCategory,
}) {
  const { data, isLoading, error } = useSpendingCategories(customerId, {
    period,
    startDate: dateParams?.startDate,
    endDate: dateParams?.endDate,
  });

  const categories = data?.categories ?? [];

  return (
    <Card
      title="Spending by Category"
      right={
        <button
          onClick={() => onSelectCategory("")}
          className="text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          Clear
        </button>
      }
    >
      {isLoading && <div className="text-sm text-slate-500">Loading categories…</div>}
      {error && <div className="text-sm text-red-600">{String(error.message || error)}</div>}

      {data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-64 rounded-2xl bg-slate-50 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={2}
                  onClick={(entry) => onSelectCategory(entry?.name || "")}
                >
                  {categories.map((c) => (
                    <Cell
                      key={c.name}
                      fill={c.color}
                      opacity={selectedCategory && selectedCategory !== c.name ? 0.35 : 1}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-500">
              Total:{" "}
              <span className="font-semibold text-slate-900">{moneyZAR(data.totalAmount)}</span>
            </div>

            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => onSelectCategory(c.name)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm
                  ${
                    selectedCategory === c.name
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
                <div className="text-xs opacity-80">{c.percentage}%</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
