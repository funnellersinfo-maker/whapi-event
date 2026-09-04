"use client";

/**
 * LÓGICA DE SESIONES "HOY"
 * ─────────────────────────
 * - Detecta la zona horaria del visitante (Intl API).
 * - Interpreta los horarios en la hora LOCAL del visitante.
 * - Bloquea automáticamente los horarios ya pasados.
 * - Escasez real: cupos pre-reservados deterministas por fecha + reservas
 *   propias persistidas en localStorage (máx. configurado en SITE_CONFIG).
 * - Calcula la próxima sesión disponible para el contador regresivo.
 */

import { SITE_CONFIG } from "@/config/site";

export interface SlotState {
  /** "08:30" */
  slot: string;
  /** "08:30 AM" */
  label: string;
  /** Fecha/hora exacta de la sesión de hoy (Date local) */
  date: Date;
  /** true si la hora ya pasó (o está por empezar) */
  passed: boolean;
  /** cupos ya ocupados (pre-reserva + propias) */
  taken: number;
  /** cupos restantes */
  seatsLeft: number;
  /** disponible para reserva */
  available: boolean;
  /** 0 = vacío aún no usado, 1..n reservas del propio usuario */
  ownBookings: number;
}

export interface DayBoard {
  slots: SlotState[];
  now: Date;
  timezone: string;
  /** Próxima sesión reservable hoy (o null) */
  nextSession: SlotState | null;
  /** Cuántas sesiones con cupo quedan hoy */
  availableToday: number;
  /** true si el usuario ya completó su registro */
  hasBooking: boolean;
}

const LS_BOOKING_KEY = "wa_event_bookings_v1";
const LS_SELECTED_KEY = "wa_event_selected_v1";

interface StoredBooking {
  slot: string;
  dateKey: string;
  name: string;
  city: string;
  business: string;
  createdAt: number;
}

/** Hash determinista → pre-reservas del día (escasez coherente por fecha) */
function seededTaken(dateKey: string, slot: string, maxSeats: number): number {
  let h = 2166136261;
  const str = `${dateKey}|${slot}`;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = (h >>> 0) / 4294967295; // 0..1
  // Distribución que favorece percepción de escasez:
  // ~25% agotado, ~50% queda 1, ~25% libre — máximo maxSeats.
  if (n < 0.25) return maxSeats;
  if (n < 0.75) return Math.max(1, maxSeats - 1);
  return Math.max(0, maxSeats - 2);
}

function dateKeyOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function slotDateToday(slot: string): Date {
  const [h, m] = slot.split(":").map((v) => parseInt(v, 10));
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function readBookings(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_BOOKING_KEY);
    return raw ? (JSON.parse(raw) as StoredBooking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: Omit<StoredBooking, "createdAt">) {
  if (typeof window === "undefined") return;
  const all = readBookings().filter(
    (b) => !(b.slot === booking.slot && b.dateKey === booking.dateKey)
  );
  all.push({ ...booking, createdAt: Date.now() });
  try {
    window.localStorage.setItem(LS_BOOKING_KEY, JSON.stringify(all));
  } catch {
    /* storage lleno o bloqueado: la reserva real llega vía WhatsApp */
  }
}

export function readSelectedSlot(): { slot: string; dateKey: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_SELECTED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSelectedSlot(slot: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LS_SELECTED_KEY,
      JSON.stringify({ slot, dateKey: dateKeyOf(new Date()) })
    );
  } catch {
    /* noop */
  }
}

export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
  } catch {
    return "local";
  }
}

/** Board completo del día (estado de cada horario) */
export function buildBoard(now: Date = new Date()): DayBoard {
  const timezone = getUserTimezone();
  const dateKey = dateKeyOf(now);
  const bookings = readBookings().filter((b) => b.dateKey === dateKey);
  const hasBooking = bookings.length > 0;
  const maxSeats = SITE_CONFIG.event.maxSeatsPerSlot;
  const lockMs = SITE_CONFIG.event.lockMinutesBefore * 60_000;

  const slots: SlotState[] = SITE_CONFIG.event.slots.map((slot) => {
    const date = slotDateToday(slot);
    const passed = now.getTime() >= date.getTime() - lockMs;
    const ownBookings = bookings.filter((b) => b.slot === slot).length;
    const pre = seededTaken(dateKey, slot, maxSeats);
    const taken = Math.min(maxSeats, pre + ownBookings);
    const seatsLeft = Math.max(0, maxSeats - taken);
    return {
      slot,
      label: formatSlot12hSafe(slot),
      date,
      passed,
      taken,
      seatsLeft,
      available: !passed && seatsLeft > 0,
      ownBookings,
    };
  });

  const availableSlots = slots.filter((s) => s.available);
  return {
    slots,
    now,
    timezone,
    nextSession: availableSlots.length > 0 ? availableSlots[0] : null,
    availableToday: availableSlots.length,
    hasBooking,
  };
}

function formatSlot12hSafe(slot: string): string {
  const [hStr, mStr] = slot.split(":");
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${mStr} ${suffix}`;
}

/** ms restantes hacia un objetivo; 0 si ya pasó */
export function msUntil(target: Date, now: Date = new Date()): number {
  return Math.max(0, target.getTime() - now.getTime());
}

/** Primer horario de mañana (para countdown cuando hoy no queda nada) */
export function tomorrowFirstSlot(): { date: Date; label: string } {
  const first = SITE_CONFIG.event.slots[0];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const [h, m] = first.split(":").map((v) => parseInt(v, 10));
  d.setHours(h, m, 0, 0);
  return { date: d, label: formatSlot12hSafe(first) };
}
