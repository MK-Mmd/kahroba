export type Status = "pending" | "confirmed" | "rejected" | "blocked";
export interface Reservation {
  id: string; name: string; phone: string; company: string; description: string;
  date: string; start: string; end: string; hasOperator: boolean; hasStream: boolean;
  total: number; status: Status; createdAt: number;
}
export type NewReservation = Omit<Reservation, "id" | "status" | "createdAt" | "total">;
export const STATUS_FA: Record<Status, string> = { pending: "در انتظار بررسی", confirmed: "تایید شده", rejected: "رد شده", blocked: "قفل توسط مدیریت" };
export const isLocking = (s: Status) => s === "pending" || s === "confirmed" || s === "blocked";
