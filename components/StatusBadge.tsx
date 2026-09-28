import { Status, STATUS_FA } from "@/lib/types";
const C: Record<Status, string> = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-emerald-100 text-emerald-700", rejected: "bg-rose-100 text-rose-700", blocked: "bg-slate-200 text-slate-600" };
export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${C[status]}`}>{STATUS_FA[status]}</span>;
}
