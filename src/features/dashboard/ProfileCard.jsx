import Card from "../../components/Card";
import { useCustomerProfile } from "../../api/queries";

function moneyZAR(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
}

export default function ProfileCard({ customerId }) {
  const { data, isLoading, error } = useCustomerProfile(customerId);

  return (
    <Card title="Customer Profile">
      {isLoading && <div className="text-sm text-slate-500">Loading profile…</div>}
      {error && <div className="text-sm text-red-600">{String(error.message || error)}</div>}

      {data && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-200" />
            <div>
              <div className="text-base font-semibold text-slate-900">{data.name}</div>
              <div className="text-sm text-slate-500">{data.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-slate-500">Account</div>
              <div className="font-medium text-slate-900">{data.accountType}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-slate-500">Joined</div>
              <div className="font-medium text-slate-900">{data.joinDate}</div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 p-4 text-white">
            <div className="text-xs opacity-80">Lifetime spent</div>
            <div className="mt-1 text-lg font-semibold">{moneyZAR(data.totalSpent)}</div>
          </div>
        </div>
      )}
    </Card>
  );
}
