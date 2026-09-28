"use client";
import { calculateTotal, formatToman, toFa, OPERATOR_RATE, STREAM_RATE } from "@/lib/pricing";

interface Props { start: string; end: string; hasOperator: boolean; hasStream: boolean; onChange: (v: { hasOperator: boolean; hasStream: boolean }) => void }

export default function PricingCalculator({ start, end, hasOperator, hasStream, onChange }: Props) {
  const p = calculateTotal(start, end, hasOperator, hasStream);
  const operatorOn = hasOperator || hasStream;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-3 font-bold">خدمات جانبی و برآورد قیمت</h3>
      <label className="flex cursor-pointer items-start gap-3 py-2">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-teal" checked={operatorOn} disabled={hasStream}
          onChange={(e) => onChange({ hasOperator: e.target.checked, hasStream: false })} />
        <span>اپراتور اختصاصی<small className="block text-slate-500">{formatToman(OPERATOR_RATE)} به ازای هر ساعت{hasStream && " — با پخش زنده اجباری است"}</small></span>
      </label>
      <label className={`flex items-start gap-3 py-2 ${operatorOn ? "cursor-pointer" : "opacity-50"}`}>
        <input type="checkbox" className="mt-1 h-4 w-4 accent-teal" checked={hasStream} disabled={!operatorOn}
          onChange={(e) => onChange({ hasOperator: true, hasStream: e.target.checked })} />
        <span>پخش زنده<small className="block text-slate-500">{formatToman(STREAM_RATE)} به ازای هر ساعت — فقط با انتخاب اپراتور</small></span>
      </label>

      <div className="mt-4 border-t border-dashed border-slate-300 pt-4 text-sm">
        {!p.valid ? <p className="text-slate-500">{p.error}</p> : (
          <dl className="space-y-2">
            <Row k={`${p.hallLabel} — ${toFa(p.hours)} ساعت`} v={formatToman(p.hallFee)} />
            {p.hasOperator && <Row k={`اپراتور (${toFa(p.hours)} ساعت)`} v={formatToman(p.operatorFee)} />}
            {p.hasStream && <Row k={`پخش زنده (${toFa(p.hours)} ساعت)`} v={formatToman(p.streamFee)} />}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-brass"><dt>مبلغ قابل پرداخت</dt><dd>{formatToman(p.total)}</dd></div>
          </dl>
        )}
      </div>
    </div>
  );
}
const Row = ({ k, v }: { k: string; v: string }) => <div className="flex justify-between gap-3"><dt className="text-slate-600">{k}</dt><dd>{v}</dd></div>;
