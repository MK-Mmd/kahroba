export const HOURLY_RATE = 5_000_000;
export const OPERATOR_RATE = 750_000;
export const STREAM_RATE = 750_000;
export const PACKAGES = [
  { key: "morning", label: "بلوک صبح (۰۶:۳۰ تا ۱۲:۳۰)", start: "06:30", end: "12:30", price: 20_000_000 },
  { key: "afternoon", label: "بلوک عصر (۱۳:۰۰ تا ۱۹:۰۰)", start: "13:00", end: "19:00", price: 20_000_000 },
  { key: "full", label: "تمام روز (۰۶:۳۰ تا ۱۹:۰۰)", start: "06:30", end: "19:00", price: 35_000_000 },
] as const;

export const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
export const toTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const overlaps = (aS: number, aE: number, bS: number, bE: number) => aS < bE && bS < aE;

const FA = "۰۱۲۳۴۵۶۷۸۹";
export const toFa = (s: string | number) => String(s).replace(/\d/g, (d) => FA[+d]);
export const toEn = (s: string) => s.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
export const formatToman = (n: number) => `${toFa(Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان`;

export interface PriceBreakdown {
  valid: boolean; error?: string; hours: number; hallFee: number; hallLabel: string;
  operatorFee: number; streamFee: number; total: number; hasOperator: boolean; hasStream: boolean;
}

/** Strict pricing. Live stream forces the operator fee. Times are "HH:mm" strings. */
export function calculateTotal(startTime: string, endTime: string, hasOperator: boolean, hasStream: boolean): PriceBreakdown {
  const s = toMin(startTime), e = toMin(endTime);
  const empty: PriceBreakdown = { valid: false, hours: 0, hallFee: 0, hallLabel: "", operatorFee: 0, streamFee: 0, total: 0, hasOperator, hasStream };
  if (!startTime || !endTime || Number.isNaN(s) || Number.isNaN(e)) return { ...empty, error: "بازه زمانی را انتخاب کنید." };
  if (e <= s) return { ...empty, error: "ساعت پایان باید بعد از ساعت شروع باشد." };
  if (s < toMin("06:30") || e > toMin("19:00")) return { ...empty, error: "ساعت کاری سالن ۰۶:۳۰ تا ۱۹:۰۰ است." };
  const operator = hasOperator || hasStream;
  const hours = (e - s) / 60;
  const pkg = PACKAGES.find((p) => p.start === startTime && p.end === endTime);
  const hallFee = pkg ? pkg.price : hours * HOURLY_RATE;
  const operatorFee = operator ? hours * OPERATOR_RATE : 0;
  const streamFee = hasStream ? hours * STREAM_RATE : 0;
  return { valid: true, hours, hallFee, hallLabel: pkg ? pkg.label : "اجاره ساعتی", operatorFee, streamFee,
    total: hallFee + operatorFee + streamFee, hasOperator: operator, hasStream };
}
