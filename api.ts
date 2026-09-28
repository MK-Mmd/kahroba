// Async mock API on localStorage. Replace bodies with fetch() calls to a real backend; signatures stay the same.
import { Reservation, NewReservation, Status, isLocking } from "./types";
import { calculateTotal, overlaps, toMin } from "./pricing";
const KEY = "hall:reservations";
const delay = () => new Promise((r) => setTimeout(r, 120));
const read = (): Reservation[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
const write = (l: Reservation[]) => localStorage.setItem(KEY, JSON.stringify(l));
const conflict = (l: Reservation[], date: string, s: string, e: string) =>
  l.some((r) => r.date === date && isLocking(r.status) && overlaps(toMin(s), toMin(e), toMin(r.start), toMin(r.end)));

export async function listReservations(): Promise<Reservation[]> { await delay(); return read(); }

export async function createReservation(input: NewReservation): Promise<Reservation> {
  await delay(); const l = read();
  const p = calculateTotal(input.start, input.end, input.hasOperator, input.hasStream);
  if (!p.valid) throw new Error(p.error);
  if (conflict(l, input.date, input.start, input.end)) throw new Error("این بازه قبلاً رزرو شده است.");
  const r: Reservation = { ...input, hasOperator: p.hasOperator, id: `R-${1000 + l.length + 1}`, status: "pending", total: p.total, createdAt: Date.now() };
  write([...l, r]); return r;
}

export async function updateStatus(id: string, status: Status): Promise<void> {
  await delay(); write(read().map((r) => (r.id === id ? { ...r, status } : r)));
}

export async function blockSlot(date: string, start: string, end: string): Promise<Reservation> {
  await delay(); const l = read();
  if (conflict(l, date, start, end)) throw new Error("این بازه قبلاً رزرو یا قفل شده است.");
  const r: Reservation = { id: `B-${1000 + l.length + 1}`, name: "مدیریت", phone: "-", company: "قفل توسط مدیریت", description: "", date, start, end,
    hasOperator: false, hasStream: false, total: 0, status: "blocked", createdAt: Date.now() };
  write([...l, r]); return r;
}
