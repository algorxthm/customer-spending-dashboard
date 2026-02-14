import Card from "../../components/Card";

export default function GoalsSection() {
  const mockGoals = [
    { category: "Entertainment", percentageUsed: 65.03, status: "on_track" },
    { category: "Groceries", percentageUsed: 96.72, status: "warning" },
  ];

  const statusLabel = (s) =>
    s === "on_track" ? "On track ✅" : s === "warning" ? "Warning ⚠" : "Over budget ⛔";

  return (
    <Card title="Goals">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {mockGoals.map((g) => (
          <div key={g.category} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">{g.category}</div>
              <div className="text-xs text-slate-500">{statusLabel(g.status)}</div>
            </div>

            <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-900"
                style={{ width: `${Math.min(100, Math.max(0, g.percentageUsed))}%` }}
              />
            </div>

            <div className="mt-2 text-xs text-slate-500">{g.percentageUsed.toFixed(2)}% used</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
