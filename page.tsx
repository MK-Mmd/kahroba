"use client";
import { useEffect, useState } from "react";
import { Check, X, Lock } from "lucide-react";
import BookingCalendar, { Selection } from "@/components/BookingCalendar";
import StatusBadge from "@/components/StatusBadge";
import { useStore } from "@/lib/store";
import { formatJalali } from "@/lib/jalali";
import { formatToman, toFa } from "@/lib/pricing";

export default function AdminPage() {
  const { reservations, load, setStatus, block } = useStore();
  const [sel, setSel] = useState<Selection>({ date: "", start: "", end: "" });
  const [err, setErr] = useState("");
  useEffect(() => { load(); }, [load]);
  const rows = [...reservations].sort((a, b) => b.createdAt - a.createdAt);

  const lock = async () => {
    setErr("");
    if (!sel.date || !sel.start) return setErr("روز و بازه را انتخاب کنید.");
    try { await block(sel.date, sel.start, sel.end); setSel({ date: "", start: "", end: "" }); } catch (e) { setErr((e as Error).message); }
  };
  const services = (r: (typeof rows)[number]) => r.status === "blocked" ? "—" : [r.hasOperator && "اپراتور", r.hasStream && "پخش زنده"].filter(Boolean).join("، ") || "فقط سالن";

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10">
      <h1 className="text-2xl font-extrabold">پنل مدیریت رزروها</h1>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-right text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr>{["شناسه","مشتری","تلفن","تاریخ","بازه زمانی","خدمات","مبلغ کل","وضعیت","عملیات"].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-slate-500">هنوز درخواستی ثبت نشده است.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 font-medium">{toFa(r.id)}</td><td className="p-3">{r.name}<small className="block text-slate-500">{r.company}</small></td>
                <td className="p-3">{toFa(r.phone)}</td><td className="p-3">{formatJalali(r.date)}</td><td className="p-3">{toFa(r.start)} تا {toFa(r.end)}</td>
                <td className="p-3">{services(r)}</td><td className="p-3 text-brass">{r.status === "blocked" ? "—" : formatToman(r.total)}</td>
                <td className="p-3"><StatusBadge status={r.status} /></td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {r.status === "pending" && <button onClick={() => setStatus(r.id, "confirmed")} className="flex items-center gap-1 rounded-lg bg-teal px-2.5 py-1.5 text-xs text-white"><Check size={14} />تایید رزرو</button>}
                    {(r.status === "pending" || r.status === "confirmed" || r.status === "blocked") && <button onClick={() => setStatus(r.id, "rejected")} className="flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs text-white"><X size={14} />{r.status === "blocked" ? "آزادسازی" : "رد درخواست"}</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">قفل سریع بازه</h2>
        <BookingCalendar reservations={reservations} value={sel} onChange={setSel} />
        {err && <p role="alert" className="text-sm text-rose-700">{err}</p>}
        <button onClick={lock} className="flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-bold text-white hover:bg-teal"><Lock size={16} />قفل توسط مدیریت</button>
      </section>
    </main>
  );
}
