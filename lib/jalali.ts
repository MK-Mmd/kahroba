import { toJalaali, toGregorian, jalaaliMonthLength } from "jalaali-js";
import { toFa } from "./pricing";
export const MONTHS = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
export const WEEKDAYS = ["ش","ی","د","س","چ","پ","ج"]; // Saturday first
export const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
export const todayISO = () => { const n = new Date(); return iso(n.getFullYear(), n.getMonth() + 1, n.getDate()); };
export const isoToJalali = (s: string) => { const [y, m, d] = s.split("-").map(Number); return toJalaali(y, m, d); };
export const jalaliToISO = (jy: number, jm: number, jd: number) => { const g = toGregorian(jy, jm, jd); return iso(g.gy, g.gm, g.gd); };
export const monthLength = jalaaliMonthLength;
/** 0 = Saturday */
export const firstWeekday = (jy: number, jm: number) => { const g = toGregorian(jy, jm, 1); return (new Date(g.gy, g.gm - 1, g.gd).getDay() + 1) % 7; };
export const formatJalali = (s: string) => { const j = isoToJalali(s); return toFa(`${j.jd} ${MONTHS[j.jm - 1]} ${j.jy}`); };
