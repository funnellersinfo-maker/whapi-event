"use client";

/**
 * SECCIÓN DE RESERVAS — El mecanismo central de conversión.
 * ─────────────────────────────────────────────────────────
 * 1) Zona horaria detectada automáticamente (Intl API).
 * 2) Horarios de HOY interpretados en la hora local del visitante.
 * 3) Los horarios pasados se bloquean/tachan solos (revisión cada 30s).
 * 4) Escasez real: máximo 2 negocios por sesión, cupos pre-reservados
 *    deterministas por fecha + reservas propias en localStorage.
 * 5) Contador regresivo REAL hasta la próxima sesión disponible
 *    (o hasta la primera sesión de mañana si hoy ya no queda nada).
 * 6) Selección → formulario (Nombre, Ciudad, Negocio) → botón mágico
 *    que abre wa.me con el mensaje personalizado en tiempo real.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Flame,
  Globe2,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { SITE_CONFIG, formatSlot12h } from "@/config/site";
import {
  buildBoard,
  saveBooking,
  saveSelectedSlot,
  readSelectedSlot,
  tomorrowFirstSlot,
  msUntil,
  type DayBoard,
  type SlotState,
} from "@/lib/schedule";
import { buildWhatsAppLink, type RegistrationData } from "@/lib/whatsapp";
import { track, EVENTS } from "@/lib/tracking";

type View = "slots" | "form" | "success";

interface FormState {
  name: string;
  city: string;
  business: string;
}

const EMPTY_FORM: FormState = { name: "", city: "", business: "" };

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Primer valor diferido al siguiente tick (evita cascadas en el mount)
    const boot = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => {
      clearTimeout(boot);
      clearInterval(id);
    };
  }, [intervalMs]);
  return now;
}

function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function ScheduleSection() {
  const [mounted, setMounted] = useState(false);
  const [board, setBoard] = useState<DayBoard | null>(null);
  const [view, setView] = useState<View>("slots");
  const [selected, setSelected] = useState<{ slot: string; day: "hoy" | "manana" } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [saved, setSaved] = useState<RegistrationData | null>(null);
  const [returningReminder, setReturningReminder] = useState<string | null>(null);
  const now = useNow(1000);
  const successRef = useRef<HTMLDivElement | null>(null);

  const tomorrow = useMemo(() => tomorrowFirstSlot(), []);

  const refreshBoard = useCallback(() => {
    const b = buildBoard();
    setBoard(b);

    // Usuario que ya reservó hoy → restaurar su sesión
    if (b.hasBooking && !saved) {
      const stored = readBookingsToday(b);
      if (stored) {
        setSaved(stored);
        setView("success");
      }
    }
  }, [saved]);

  useEffect(() => {
    // Montaje diferido: el tablero depende de la hora real y de localStorage,
    // se calcula en el cliente un tick después del mount (sin cascadas).
    const boot = setTimeout(() => {
      setMounted(true);
      refreshBoard();

      // Recordatorio: eligió horario pero no completó
      const sel = readSelectedSlot();
      if (sel) {
        const todayKey = localDateKey();
        if (sel.dateKey === todayKey) {
          setReturningReminder(sel.slot);
        }
      }
    }, 0);

    const id = setInterval(refreshBoard, 30_000);
    const onVis = () => document.visibilityState === "visible" && refreshBoard();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimeout(boot);
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refreshBoard]);

  /* Countdown hacia la próxima sesión disponible */
  const countdown = useMemo(() => {
    if (!now || !board) return null;
    if (board.nextSession) {
      const ms = msUntil(board.nextSession.date, now);
      if (ms > 0) {
        return { ms, label: "La próxima sesión comienza en" };
      }
    }
    const msT = msUntil(tomorrow.date, now);
    if (msT > 0) {
      return { ms: msT, label: "Hoy se llenó. Primera sesión de mañana en" };
    }
    return null;
  }, [now, board, tomorrow]);

  const isTomorrowMode = mounted && (board?.nextSession == null);

  const selectSlot = (slot: SlotState) => {
    if (!slot.available) return;
    setSelected({ slot: slot.slot, day: "hoy" });
    setView("form");
    saveSelectedSlot(slot.slot);
    track(EVENTS.SCHEDULE_SELECT, { content_name: "sesion_hoy", value: slot.slot });
    requestAnimationFrame(() => {
      document.getElementById("registro")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const selectTomorrow = () => {
    setSelected({ slot: tomorrow.label, day: "manana" });
    setView("form");
    track(EVENTS.SCHEDULE_SELECT, {
      content_name: "sesion_manana",
      value: SITE_CONFIG.event.slots[0],
    });
    requestAnimationFrame(() => {
      document.getElementById("registro")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (form.name.trim().length < 2) e.name = "Escribe tu nombre";
    if (form.city.trim().length < 2) e.city = "Escribe tu ciudad";
    if (form.business.trim().length < 2) e.business = "Escribe tu negocio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitForm = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || !selected) return;
    const data: RegistrationData = {
      slot: selected.day === "manana" ? SITE_CONFIG.event.slots[0] : selected.slot,
      name: form.name.trim(),
      city: form.city.trim(),
      business: form.business.trim(),
      day: selected.day,
    };
    // Reserva local del cupo (persiste para escasez y estado de retorno)
    saveBooking({
      slot: data.slot,
      dateKey: localDateKey(),
      name: data.name,
      city: data.city,
      business: data.business,
    });
    setSaved(data);
    setView("success");
    setReturningReminder(null);
    track(EVENTS.INITIATE_CHECKOUT, { content_name: "registro_completado" });
    requestAnimationFrame(() => {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const activateWhatsApp = () => {
    if (!saved) return;
    track(EVENTS.LEAD, {
      content_name: "activacion_experiencia_whatsapp",
      value: saved.slot,
    });
    window.open(buildWhatsAppLink(saved), "_blank", "noopener,noreferrer");
  };

  if (!mounted || !board) {
    return (
      <section id="reservar" className="relative py-16">
        <ScheduleSkeleton />
      </section>
    );
  }

  const scarce = board.availableToday > 0 && board.availableToday <= 3;

  return (
    <section id="reservar" className="relative overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(37,211,102,0.1),transparent)]"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        {/* Encabezado dinámico */}
        <div className="text-center">
          {scarce ? (
            <motion.p
              key="scarce"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-warn/40 bg-amber-warn/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-warn"
            >
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              Últimos {board.availableToday} horarios disponibles hoy
            </motion.p>
          ) : (
            <motion.p
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-wa/70"
            >
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              Reserva tu cupo
            </motion.p>
          )}

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ELIGE TU <span className="text-gradient-wa">SESIÓN DE HOY</span>
          </h2>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-wa/60" aria-hidden="true" />
              Horarios en tu zona: {board.timezone}
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/60">
              <Zap className="h-3.5 w-3.5 text-wa-glow" aria-hidden="true" />
              Máximo {SITE_CONFIG.event.maxSeatsPerSlot} negocios por sesión
            </span>
          </div>
        </div>

        {/* Contador regresivo real */}
        <CountdownCard countdown={countdown} tomorrowLabel={tomorrow.label} />

        {/* Recordatorio de reserva incompleta */}
        <AnimatePresence>
          {returningReminder && view === "slots" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto mb-6 mt-2 flex w-fit items-center gap-2.5 rounded-2xl border border-amber-warn/30 bg-amber-warn/8 px-5 py-3 text-sm text-amber-warn"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                Tu cupo de las{" "}
                <strong>{formatSlot12h(returningReminder)}</strong> se está
                liberando. <strong>Complétalo abajo.</strong>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vista: selección de horarios */}
        <AnimatePresence mode="wait">
          {view === "slots" && (
            <motion.div
              key="slots"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <SlotGrid board={board} onSelect={selectSlot} />

              {/* Modo mañana: hoy agotado */}
              {isTomorrowMode && (
                <motion.button
                  type="button"
                  onClick={selectTomorrow}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass card-lift group mt-5 flex w-full items-center justify-between rounded-2xl border-wa/25 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-wa/30 bg-wa/10 text-sm font-bold text-wa">
                      MA
                    </span>
                    <span>
                      <span className="block text-base font-bold text-white">
                        Mañana · {tomorrow.label}
                      </span>
                      <span className="block text-xs text-white/55">
                        Reserva anticipada — la sesión se activa sola
                      </span>
                    </span>
                  </span>
                  <ArrowRight
                    className="h-5 w-5 text-wa transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Vista: formulario */}
          {view === "form" && selected && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              id="registro"
              className="glass-strong glow-wa relative rounded-3xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wa">
                  <Check className="h-5 w-5 text-[#04120a]" strokeWidth={3} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">
                    ¡Cupo seleccionado!
                  </p>
                  <p className="text-xs text-white/55">
                    Sesión de{" "}
                    {selected.day === "manana" ? "mañana" : "hoy"} ·{" "}
                    {selected.day === "manana"
                      ? tomorrow.label
                      : formatSlot12h(selected.slot)}
                  </p>
                </div>
              </div>

              <form onSubmit={submitForm} noValidate className="mt-7 space-y-4">
                <FormInput
                  id="reg-name"
                  label="Tu nombre"
                  placeholder="¿Cómo te llamas?"
                  autoComplete="name"
                  value={form.name}
                  error={errors.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                />
                <FormInput
                  id="reg-city"
                  label="Ciudad"
                  placeholder="Ej. Bogotá"
                  autoComplete="address-level2"
                  value={form.city}
                  error={errors.city}
                  onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                />
                <FormInput
                  id="reg-business"
                  label="Negocio o empresa"
                  placeholder="Ej. Tienda de ropa, clínica dental…"
                  autoComplete="organization"
                  value={form.business}
                  error={errors.business}
                  onChange={(v) => setForm((f) => ({ ...f, business: v }))}
                />

                <button
                  type="submit"
                  className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-wa px-6 py-4 text-base font-bold uppercase tracking-wide text-[#04120a] transition-all duration-300 hover:scale-[1.01] hover:bg-[#2ee276] active:scale-[0.99]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  Continuar
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setView("slots");
                    setSelected(null);
                  }}
                  className="w-full text-center text-xs text-white/45 underline-offset-4 hover:text-white/70 hover:underline"
                >
                  Cambiar de horario
                </button>
              </form>
            </motion.div>
          )}

          {/* Vista: éxito + activación */}
          {view === "success" && saved && (
            <motion.div
              key="success"
              ref={successRef}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-strong glow-wa relative overflow-hidden rounded-3xl p-6 sm:p-8"
            >
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-wa/15 blur-3xl"
              />

              <div className="relative text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wa glow-wa"
                >
                  <Check className="h-7 w-7 text-[#04120a]" strokeWidth={3} aria-hidden="true" />
                </motion.div>

                <h3 className="mt-5 text-2xl font-bold text-white">
                  ¡Listo, {saved.name.split(" ")[0]}!
                </h3>
                <p className="mt-2 text-white/70">
                  Tu sesión de{" "}
                  <strong className="text-wa-glow">
                    {saved.day === "manana" ? "mañana" : "hoy"}{" "}
                    {formatSlot12h(saved.slot)}
                  </strong>{" "}
                  quedó apartada.
                </p>

                <div className="mx-auto mt-6 max-w-md space-y-2.5 text-left">
                  {[
                    "1. Abre WhatsApp con el botón de abajo",
                    "2. La IA te recibe y confirma tu cupo al instante",
                    "3. Recibes el acceso a la sesión en vivo",
                  ].map((step) => (
                    <p
                      key={step}
                      className="glass rounded-xl px-4 py-2.5 text-sm text-white/75"
                    >
                      {step}
                    </p>
                  ))}
                </div>

                {/* BOTÓN MÁGICO */}
                <button
                  type="button"
                  onClick={activateWhatsApp}
                  className="group relative mt-7 inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-wa px-6 py-4.5 text-base font-bold uppercase tracking-wide text-[#04120a] animate-glow-breath transition-all duration-300 hover:scale-[1.01] hover:bg-[#2ee276] active:scale-[0.99] sm:w-auto sm:min-w-[320px]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <Sparkles className="relative h-5 w-5" aria-hidden="true" />
                  <span className="relative">
                    Activar mi experiencia en WhatsApp
                  </span>
                  <ArrowRight
                    className="relative h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>

                <p className="mt-4 text-xs text-white/40">
                  {SITE_CONFIG.whatsapp.display} · Se abre WhatsApp con tu
                  registro listo para enviar
                </p>

                {SITE_CONFIG.whatsapp.groupLink ? (
                  <a
                    href={SITE_CONFIG.whatsapp.groupLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-semibold text-wa underline-offset-4 hover:underline"
                  >
                    Entrar directamente al grupo del evento
                  </a>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ── Sub-componentes ─────────────────────────────── */

function localDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readBookingsToday(board: DayBoard): RegistrationData | null {
  try {
    const raw = window.localStorage.getItem("wa_event_bookings_v1");
    if (!raw) return null;
    const list = JSON.parse(raw) as Array<{
      slot: string;
      dateKey: string;
      name: string;
      city: string;
      business: string;
    }>;
    const today = localDateKey();
    const found = [...list].reverse().find((b) => b.dateKey === today);
    if (!found) return null;
    return { ...found, day: "hoy" };
  } catch {
    return null;
  }
}

function CountdownCard({
  countdown,
  tomorrowLabel,
}: {
  countdown: { ms: number; label: string } | null;
  tomorrowLabel: string;
}) {
  if (!countdown) return null;
  const isTomorrow = countdown.label.includes("mañana");
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass mx-auto mt-8 flex w-fit max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl px-6 py-4"
    >
      <span className="text-xs uppercase tracking-[0.18em] text-white/50">
        {countdown.label}
      </span>
      <span
        className="font-mono text-2xl font-bold tabular-nums tracking-wider text-wa-glow text-glow-wa sm:text-3xl"
        aria-live="polite"
      >
        {formatCountdown(countdown.ms)}
      </span>
      {isTomorrow && (
        <span className="text-xs text-white/45">
          (Sesión {tomorrowLabel})
        </span>
      )}
    </motion.div>
  );
}

function SlotGrid({
  board,
  onSelect,
}: {
  board: DayBoard;
  onSelect: (slot: SlotState) => void;
}) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {board.slots.map((slot, i) => (
        <SlotCard key={slot.slot} slot={slot} index={i} onSelect={onSelect} />
      ))}
    </div>
  );
}

function SlotCard({
  slot,
  index,
  onSelect,
}: {
  slot: SlotState;
  index: number;
  onSelect: (slot: SlotState) => void;
}) {
  const status = slot.passed
    ? { label: "COMENZÓ", tone: "passed" as const }
    : slot.seatsLeft === 0
      ? { label: "AGOTADO", tone: "full" as const }
      : slot.seatsLeft === 1
        ? { label: "1 CUPO", tone: "scarce" as const }
        : { label: `${slot.seatsLeft} CUPOS`, tone: "open" as const };

  const disabled = !slot.available;

  const base =
    "group relative flex flex-col items-center gap-1.5 rounded-2xl px-3 py-4 text-center transition-all duration-300";
  const toneClass =
    status.tone === "passed"
      ? "border-white/5 bg-white/[0.02] opacity-45"
      : status.tone === "full"
        ? "border-white/6 bg-white/[0.02] opacity-55"
        : "glass card-lift cursor-pointer hover:border-wa/45";

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      onClick={() => onSelect(slot)}
      disabled={disabled}
      aria-label={
        disabled
          ? `Sesión ${slot.label} no disponible`
          : slot.seatsLeft === 1
            ? `Reservar sesión de hoy ${slot.label}, queda 1 cupo`
            : `Reservar sesión de hoy ${slot.label}, ${slot.seatsLeft} cupos disponibles`
      }
      aria-disabled={disabled}
      className={`${base} ${toneClass} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {status.tone === "scarce" && (
        <Flame
          className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-amber-warn"
          aria-hidden="true"
        />
      )}
      {status.tone === "passed" && (
        <Lock className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-white/30" aria-hidden="true" />
      )}

      <span
        className={`font-mono text-lg font-bold tabular-nums ${
          disabled ? "text-white/35 line-through" : "text-white"
        }`}
      >
        {slot.label}
      </span>
      <span
        className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
          status.tone === "scarce"
            ? "text-amber-warn"
            : status.tone === "full" || status.tone === "passed"
              ? "text-white/40"
              : "text-wa/90"
        }`}
      >
        {status.label}
      </span>
    </motion.button>
  );
}

function FormInput({
  id,
  label,
  placeholder,
  autoComplete,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
        {label}
      </label>
      <Input
        id={id}
        type="text"
        inputMode="text"
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-12 rounded-xl border-white/10 bg-ink-2/60 text-base text-white placeholder:text-white/30 focus-visible:border-wa/50 focus-visible:ring-wa/30"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <div className="mx-auto h-8 w-64 animate-pulse rounded-full bg-white/5" />
      <div className="mx-auto mt-4 h-10 w-80 animate-pulse rounded-full bg-white/5" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl bg-white/[0.04]"
            style={{ animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
