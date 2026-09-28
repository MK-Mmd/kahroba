"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS, WEEKDAYS, firstWeekday, isoToJalali, jalaliToISO, monthLength, todayISO } from "@/lib/jalali";
import { PACKAGES, overlaps, toFa, toMin, toTime } from "@/lib/pricing";
import { Reservation, isLocking } from "@/lib/types";

export interface Selection { date: string; start: string; end: string }
interface Props { reservations: Reservation[]; value: Selection; onChange: (v: Selection) => void }

const CELLS = Array.from({ length: 25 }, (_, i) => 390 + i * 30); // 06:30 → 19:00

export default function BookingCalendar({ reservations, value, onChange }: Props) {
  const t = isoToJalali(value.date || todayISO());
  const [ym, setYm] = useState({ y: t.jy, m: t.jm });
  const [anchor, setAnchor] = useState<number | null>(null);
  const today = todayISO();

  const dayRes = useMemo(() => reservations.filter((r) => r.date === value.date && isLocking(r.status)), [reservations, value.date]);
  const cellOwner = (c: number) => dayRes.find((r) => overlaps(c, c + 30, toMin(r.start), toMin(r.end)));
  const rangeFree = (a: number, b: number) => !dayRes.some((r) => overlaps(a, b, toMin(r.start), toMin(r.end)));

  const shift = (d: number) => setYm(({ y, m }) => { const n = m - 1 + d; return { y: y + Math.floor(n / 12), m: ((n % 12) + 12) % 12 + 1 }; });
  const pickDay = (iso: string) => { setAnchor(null); onChange({ date: iso, start: "", end: "" }); };

  const pickCell = (c: number) => {
    if (anchor === null) { setAnchor(c); onChange({ ...value, start: toTime(c), end: toTime(c + 30) }); return; }
    const a = Math.min(anchor, c), b = Math.max(anchor, c) + 30;
    if (rangeFree(a, b)) onChange({ ...value, start: toTime(a), end: toTime(b) });
    else onChange({ ...value, start: toTime(c), end: toTime(c + 30) }); // range hit a locked cell → restart here
    setAnchor(null);
  };

  const days = monthLength(ym.y, ym.m), lead = firstWeekday(ym.y, ym.m);
  const inRange = (c: number) => value.start && c >= toMin(value.start) && c + 30 <= toMin(value.end);

  return (
    <div className="grid gap-6 md:grid-cols-[320px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <button aria-label="ماه بعد" onClick={() => shift(1)} className="rounded-lg p-2 hover:bg-slate-100"><ChevronLeft size={18} /></button>
          <div className="font-bold">{MONTHS[ym.m - 1]} {toFa(ym.y)}</div>
          <button aria-label="ماه قبل" onClick={() => shift(-1)} className="rounded-lg p-2 hover:bg-slate-100"><ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
          {WEEKDAYS.map((w) => <div key={w} className="py-1">{w}</div>)}
          {Array.from({ length: lead }).map((_, i) => <div key={"e" + i} />)}
          {Array.from({ length: days }, (_, i) => {
            const iso = jalaliToISO(ym.y, ym.m, i + 1);
            const past = iso < today, sel = iso === value.date;
            const busy = reservations.some((r) => r.date === iso && isLocking(r.status));
            return (
              <button key={iso} disabled={past} onClick={() => pickDay(iso)}
                className={`relative aspect-square rounded-lg text-sm transition ${sel ? "bg-teal text-white font-bold" : past ? "text-slate-300" : "hover:bg-teal-soft"} ${iso === today && !sel ? "ring-1 ring-teal" : ""}`}>
                {toFa(i + 1)}
                {busy && <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${sel ? "bg-white" : "bg-brass"}`} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        {!value.date ? <p className="py-16 text-center text-slate-500">ابتدا یک روز را از تقویم انتخاب کنید.</p> : (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              {PACKAGES.map((p) => (
                <button key={p.key} disabled={!rangeFree(toMin(p.start), toMin(p.end))}
                  onClick={() => { setAnchor(null); onChange({ ...value, start: p.start, end: p.end }); }}
                  className="rounded-full border border-teal px-3 py-1 text-xs text-teal hover:bg-teal-soft disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-transparent">
                  {p.label}
                </button>
              ))}
            </div>
            <p className="mb-2 text-xs text-slate-500">برای بازه دلخواه، اولین و آخرین نیم‌ساعت را انتخاب کنید.</p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {CELLS.map((c) => {
                const o = cellOwner(c), sel = inRange(c);
                const cls = o ? (o.status === "confirmed" ? "bg-rose-100 text-rose-400" : o.status === "blocked" ? "bg-slate-200 text-slate-400" : "bg-amber-100 text-amber-500")
                  : sel ? "bg-teal text-white" : "bg-teal-soft text-teal hover:bg-teal/20";
                return (
                  <button key={c} disabled={!!o} onClick={() => pickCell(c)} title={o ? (o.status === "confirmed" ? "تایید شده" : o.status === "blocked" ? "قفل توسط مدیریت" : "در انتظار تایید") : "آزاد"}
                    className={`rounded-lg py-2 text-xs ${cls} ${o ? "cursor-not-allowed" : ""}`}>
                    {toFa(toTime(c))}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
              <Legend c="bg-teal-soft" t="آزاد" /><Legend c="bg-amber-100" t="در انتظار تایید" /><Legend c="bg-rose-100" t="تایید شده" /><Legend c="bg-slate-200" t="قفل مدیریت" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
const Legend = ({ c, t }: { c: string; t: string }) => <span className="flex items-center gap-1.5"><i className={`h-3 w-3 rounded ${c}`} />{t}</span>;
