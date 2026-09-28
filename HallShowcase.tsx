"use client";
import { useState } from "react";
import { Users, Speaker, Monitor, Wifi, UtensilsCrossed, ParkingCircle } from "lucide-react";
import { formatToman, toFa, PACKAGES, HOURLY_RATE, OPERATOR_RATE, STREAM_RATE } from "@/lib/pricing";

const IMAGES = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&q=80",
  "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1400&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80",
];
const AMENITIES = [
  { i: Users, t: "ظرفیت ۲۰۰ نفر", d: "چیدمان تئاتری و کلاسی" }, { i: Speaker, t: "سیستم صدا و نور صحنه", d: "صدای حرفه‌ای و نورپردازی سه‌بعدی" },
  { i: Monitor, t: "نمایشگر LED", d: "تصویر شفاف برای ارائه و پخش" }, { i: Wifi, t: "وای‌فای پرسرعت", d: "اینترنت پایدار برای همه مهمانان" },
  { i: UtensilsCrossed, t: "پذیرایی VIP", d: "پذیرایی اختصاصی در محل" }, { i: ParkingCircle, t: "پارکینگ اختصاصی", d: "ورودی جدا برای مهمانان" },
];

export default function HallShowcase() {
  const [i, setI] = useState(0);
  return (
    <>
      <header className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold leading-relaxed md:text-4xl">سالن همایش، آماده میزبانی رویداد شما</h1>
            <p className="mt-4 max-w-md leading-8 text-slate-300">روز و ساعت را در تقویم شمسی انتخاب کنید، هزینه را همان لحظه ببینید و درخواستتان را ثبت کنید.</p>
            <a href="#booking" className="mt-6 inline-block rounded-xl bg-brass px-6 py-3 font-bold text-white hover:opacity-90">رزرو سالن</a>
          </div>
          <div>
            <img src={IMAGES[i]} alt={`نمای سالن ${toFa(i + 1)}`} className="aspect-[16/10] w-full rounded-2xl object-cover" />
            <div className="mt-3 grid grid-cols-4 gap-2">
              {IMAGES.map((s, k) => (
                <button key={s} onClick={() => setI(k)} aria-label={`تصویر ${toFa(k + 1)}`} className={`overflow-hidden rounded-lg ${k === i ? "ring-2 ring-brass" : "opacity-60 hover:opacity-100"}`}>
                  <img src={s.replace("w=1400", "w=300")} alt="" className="aspect-video w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-extrabold">امکانات سالن</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map(({ i: Icon, t, d }) => (
            <div key={t} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <Icon className="mt-1 shrink-0 text-teal" size={26} />
              <div><div className="font-bold">{t}</div><div className="mt-1 text-sm text-slate-600">{d}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <h2 className="mb-6 text-2xl font-extrabold">تعرفه‌ها</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[480px] text-right text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">مورد</th><th className="p-3">بازه</th><th className="p-3">مبلغ</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {PACKAGES.map((p) => (<tr key={p.key}><td className="p-3 font-medium">{p.label.split(" (")[0]}</td><td className="p-3">{toFa(p.start)} تا {toFa(p.end)}</td><td className="p-3 text-brass">{formatToman(p.price)}</td></tr>))}
              <tr><td className="p-3 font-medium">اجاره ساعتی</td><td className="p-3">هر بازه دلخواه</td><td className="p-3 text-brass">{formatToman(HOURLY_RATE)} / ساعت</td></tr>
              <tr><td className="p-3 font-medium">اپراتور اختصاصی</td><td className="p-3">به ازای هر ساعت</td><td className="p-3 text-brass">{formatToman(OPERATOR_RATE)}</td></tr>
              <tr><td className="p-3 font-medium">پخش زنده</td><td className="p-3">به ازای هر ساعت، همراه اپراتور</td><td className="p-3 text-brass">{formatToman(STREAM_RATE)}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
