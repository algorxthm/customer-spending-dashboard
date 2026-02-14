import Card from "../../components/Card";

export default function ProfileCard({ customerId }) {
  // Placeholder until we wire the API.
  return (
    <Card title="Customer Profile">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-200" />
          <div>
            <div className="text-base font-semibold text-slate-900">John Doe</div>
            <div className="text-sm text-slate-500">john.doe@email.com</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-slate-500">Account</div>
            <div className="font-medium text-slate-900">premium</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-slate-500">Joined</div>
            <div className="font-medium text-slate-900">2023-01-15</div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 p-4 text-white">
          <div className="text-xs opacity-80">Lifetime spent</div>
          <div className="mt-1 text-lg font-semibold">R 15,420.50</div>
        </div>
      </div>
    </Card>
  );
}
