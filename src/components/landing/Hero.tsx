"use client";

/**
 * HERO — PRIMER BLOQUE DE CONVERSIÓN.
 * ─────────────────────────────────────────────────────────
 * Hook (badge + titular + subheadline + CTA de AGENDAMIENTO)
 * → CALENDARIO DE SESIONES embebido a continuación (mismo
 *   bloque, visible sin scroll profundo — prioridad absoluta:
 *   AGENDAR) → demo del teléfono como prueba visual.
 * Animación palabra por palabra con Framer Motion, glow y partículas.
 */

import { motion } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";
import { PhoneDemo } from "./PhoneDemo";
import { ParticleField } from "./ParticleField";
import { ScheduleSection } from "./ScheduleSection";
import { SITE_CONFIG } from "@/config/site";

const TITLE_LINES = [
  { words: ["¿Y", "SI", "TU", "WHATSAPP"], highlight: null },
  { words: ["PUDIERA", "VENDER"], highlight: "VENDER" },
  { words: ["MIENTRAS", "TÚ", "NO", "ESTÁS?"], highlight: null },
];

export function Hero() {
  const scrollToSchedule = () => {
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="relative overflow-hidden">
      {/* Fondo: gradientes radiales + partículas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,211,102,0.16),transparent),radial-gradient(ellipse_40%_35%_at_85%_60%,rgba(0,229,160,0.07),transparent)]"
      />
      <ParticleField />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:pb-28 lg:pt-24">
        {/* ── HOOK (centrado, foco total en agendar) ── */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge en vivo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass mx-auto inline-flex items-center gap-2.5 rounded-full px-4 py-2"
          >
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[#ff4d4d]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 sm:text-xs">
              {SITE_CONFIG.event.badge}
            </span>
            <Radio className="h-3.5 w-3.5 text-wa/70" aria-hidden="true" />
          </motion.div>

          {/* Titular */}
          <h1 className="mt-7 text-[clamp(2.1rem,7.5vw,4.4rem)] font-bold leading-[1.04] tracking-tight">
            {TITLE_LINES.map((line, li) => (
              <span key={li} className="block">
                {line.words.map((word, wi) => {
                  const isHi = word === line.highlight;
                  const delay = 0.15 + li * 0.28 + wi * 0.08;
                  return (
                    <motion.span
                      key={wi}
                      initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className={
                        isHi
                          ? "text-gradient-wa text-glow-wa mr-[0.24em] inline-block"
                          : "mr-[0.24em] inline-block text-white"
                      }
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/65 sm:text-lg"
          >
            Descubre <strong className="font-semibold text-white/90">en vivo</strong> cómo
            empresas están convirtiendo WhatsApp en un sistema que{" "}
            <span className="text-white/90">responde, califica, hace seguimiento y vende</span>{" "}
            automáticamente con IA.
          </motion.p>

          {/* CTA principal — prioridad: AGENDAR */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.6 }}
            className="mt-9"
          >
            <HeroCta onClick={scrollToSchedule} label="RESERVAR MI LUGAR GRATIS" />
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/40">
              Cupos limitados · Acceso gratuito
            </p>
          </motion.div>
        </div>

        {/* ── AGENDAMIENTO — embebido en el PRIMER BLOQUE ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-14"
        >
          <ScheduleSection embedded />
        </motion.div>

        {/* ── PRUEBA VISUAL — demo del teléfono ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 sm:mt-20"
        >
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">
            Esto es lo que verás funcionando en vivo
          </p>
          <div className="mt-6 flex justify-center">
            <PhoneDemo />
          </div>
        </motion.div>
      </div>
    </header>
  );
}

export function HeroCta({
  onClick,
  label = "RESERVAR MI LUGAR GRATIS",
  id,
}: {
  onClick: () => void;
  label?: string;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      aria-label={`${label} — Agenda tu sesión del evento en vivo gratis`}
      className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-wa px-8 py-4 text-base font-bold uppercase tracking-wide text-[#04120a] transition-all duration-300 animate-glow-breath hover:scale-[1.02] hover:bg-[#2ee276] active:scale-[0.98] sm:w-auto sm:min-w-[300px]"
    >
      {/* brillo al pasar el cursor */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      <span className="relative">{label}</span>
      <ArrowRight
        className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
        aria-hidden="true"
      />
    </button>
  );
}
