"use client";
import { create } from "zustand";
import * as api from "./api";
import { Reservation, NewReservation, Status } from "./types";
interface S {
  reservations: Reservation[]; myIds: string[]; loaded: boolean;
  load: () => Promise<void>;
  create: (i: NewReservation) => Promise<Reservation>;
  setStatus: (id: string, s: Status) => Promise<void>;
  block: (d: string, s: string, e: string) => Promise<void>;
}
const MY = "hall:my-ids";
export const useStore = create<S>((set, get) => ({
  reservations: [], myIds: [], loaded: false,
  load: async () => {
    const myIds = JSON.parse(localStorage.getItem(MY) || "[]");
    set({ reservations: await api.listReservations(), myIds, loaded: true });
  },
  create: async (i) => {
    const r = await api.createReservation(i);
    const myIds = [...get().myIds, r.id]; localStorage.setItem(MY, JSON.stringify(myIds));
    set({ myIds, reservations: await api.listReservations() }); return r;
  },
  setStatus: async (id, s) => { await api.updateStatus(id, s); set({ reservations: await api.listReservations() }); },
  block: async (d, s, e) => { await api.blockSlot(d, s, e); set({ reservations: await api.listReservations() }); },
}));
