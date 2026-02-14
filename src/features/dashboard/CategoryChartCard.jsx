import Card from "../../components/Card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// Mock data shaped like GET /spending/categories :contentReference[oaicite:1]{index=1}
const mockCategoriesResponse = {
  totalAmount: 4250.75,
  categories: [
    { name: "Groceries", amount: 1250.3, percentage: 29.4, color: "#FF6B6B", icon: "shopping-cart" },
    { name: "Entertainment", amount: 890.2, percentage: 20.9, color: "#4ECDC4", icon: "film" },
    { name: "Transportation", amount: 680.45, percentage: 16.0, color: "#45B7D1", icon: "car" },
    { name: "Dining", amount: 520.3, percentage: 12.2, color: "#F7DC6F", icon: "utensils" },
    { name: "Shopping", amount: 450.8, percentage: 10.6, color: "#BB8FCE", icon: "shopping-bag" },
    { name: "Utilities", amount: 458.7, percentage: 10.8, color: "#85C1E9", icon: "zap" },
  ],
};

function money(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <div className="font-semibold text-slate-900">{p.name}</div>
      <div className="text-slate-600">{money(p.amount)}</div>
      <div className="text-slate-500">{p.percentage}%</div>
    </div>
  );
}

export default function CategoryChartCard({ selectedCategory, onSelectCategory }) {
  const data = mockCategoriesResponse.categories;

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Donut */}
        <div className="h-64 rounded-2xl bg-slate-50 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={2}
                onClick={(entry) => onSelectCategory(entry?.name || "")}
              >
                {data.map((c) => (
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

        {/* Legend / selectors */}
        <div className="space-y-2">
          <div className="text-xs text-slate-500">
            Total: <span className="font-semibold text-slate-900">{money(mockCategoriesResponse.totalAmount)}</span>
          </div>

          {data.map((c) => (
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
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span>{c.name}</span>
              </div>
              <div className="text-xs opacity-80">{c.percentage}%</div>
            </button>
          ))}

          <div className="pt-2 text-xs text-slate-500">
            Selected: <span className="font-medium text-slate-900">{selectedCategory || "None"}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
