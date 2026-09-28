"use client";
import { useEffect, useState } from "react";
import BookingCalendar, { Selection } from "./BookingCalendar";
import PricingCalculator from "./PricingCalculator";
import Tracker from "./Tracker";
import { useStore } from "@/lib/store";
import { calculateTotal, toEn } from "@/lib/pricing";
import { formatJalali } from "@/lib/jalali";

export default function BookingSection() {
  const { reservations, load, create } = useStore();
  const [sel, setSel] = useState<Selection>({ date: "", start: "", end: "" });
  const [svc, setSvc] = useState({ hasOperator: false, hasStream: false });
  const [f, setF] = useState({ name: "", phone: "", company: "", description: "" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [ok, setOk] = useState("");
  useEffect(() => { load(); }, [load]);

  const price = calculateTotal(sel.start, sel.end, svc.hasOperator, svc.hasStream);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setOk("");
    const phone = toEn(f.phone).replace(/\s/g, "");
    if (!sel.date || !price.valid) return setErr("روز و بازه زمانی را انتخاب کنید.");
    if (f.name.trim().length < 3) return setErr("نام و نام خانوادگی را کامل وارد کنید.");
    if (!/^09\d{9}$/.test(phone)) return setErr("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.");
    setBusy(true);
    try {
      const r = await create({ ...f, phone, ...sel, ...svc });
      setOk(`درخواست شما با کد ${r.id} برای ${formatJalali(r.date)} ثبت شد و در انتظار تایید مدیر است.`);
      setSel({ date: "", start: "", end: "" }); setSvc({ hasOperator: false, hasStream: false }); setF({ name: "", phone: "", company: "", description: "" });
    } catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  };
  const inp = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal";

  return (
    <section id="booking" className="mx-auto max-w-6xl space-y-6 px-4 py-14">
      <h2 className="text-2xl font-extrabold">رزرو سالن</h2>
      <BookingCalendar reservations={reservations} value={sel} onChange={setSel} />
      <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold">اطلاعات رزرو‌کننده</h3>
          <input className={inp} placeholder="نام و نام خانوادگی" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className={inp} inputMode="numeric" dir="ltr" style={{ textAlign: "right" }} placeholder="شماره موبایل (۰۹۱۲۳۴۵۶۷۸۹)" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <input className={inp} placeholder="نام شرکت / رویداد" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} />
          <textarea className={inp} rows={3} placeholder="توضیحات" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        </div>
        <div className="space-y-4">
          <PricingCalculator start={sel.start} end={sel.end} {...svc} onChange={setSvc} />
          {err && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{err}</p>}
          {ok && <p role="status" className="rounded-xl bg-teal-soft p-3 text-sm text-teal">{ok}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-ink py-3 font-bold text-white hover:bg-teal disabled:opacity-60">{busy ? "در حال ثبت…" : "ثبت درخواست رزرو"}</button>
        </div>
      </form>
      <Tracker />
    </section>
  );
}
