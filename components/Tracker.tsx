"use client";
import { useStore } from "@/lib/store";
import { formatJalali } from "@/lib/jalali";
import { formatToman, toFa } from "@/lib/pricing";
import { STATUS_FA } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const STEPS = ["ثبت درخواست", "بررسی مدیر", "نتیجه"];
export default function Tracker() {
  const { reservations, myIds } = useStore();
  const mine = reservations.filter((r) => myIds.includes(r.id)).reverse();
  if (!mine.length) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">پیگیری درخواست‌های شما</h3>
      {mine.map((r) => {
        const step = r.status === "pending" ? 1 : 2;
        return (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-bold">{toFa(r.id)}</span>
              <span>{formatJalali(r.date)} — {toFa(r.start)} تا {toFa(r.end)}</span>
              <span className="text-brass">{formatToman(r.total)}</span>
              <StatusBadge status={r.status} />
            </div>
            <ol className="mt-3 flex gap-2 text-xs">
              {STEPS.map((s, i) => (
                <li key={s} className={`flex-1 rounded-lg py-1.5 text-center ${i <= step ? (i === 2 && r.status === "rejected" ? "bg-rose-100 text-rose-700" : "bg-teal text-white") : "bg-slate-100 text-slate-400"}`}>
                  {i === 2 && i <= step ? STATUS_FA[r.status] : s}
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
