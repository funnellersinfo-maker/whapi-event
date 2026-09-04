"use client";

/**
 * HERO — PRIMER BLOQUE DE CONVERSIÓN.
 * ─────────────────────────────────────────────────────────
 * Credencial oficial Meta Business Partner + chip WhatsApp API
 * en la parte superior del hook → titular + subheadline + CTA
 * de AGENDAMIENTO → CALENDARIO DE SESIONES embebido (mismo
 * bloque, prioridad absoluta: AGENDAR) → demo del teléfono.
 * Animación palabra por palabra con Framer Motion, glow y partículas.
 */

import { motion } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";
import { PhoneDemo } from "./PhoneDemo";
import { ParticleField } from "./ParticleField";
import { ScheduleSection } from "./ScheduleSection";
import { SITE_CONFIG } from "@/config/site";
import { goToSchedule } from "@/lib/navigation";

const TITLE_LINES = [
  { words: ["¿Y", "SI", "TU", "WHATSAPP"], highlight: null },
  { words: ["PUDIERA", "VENDER"], highlight: "VENDER" },
  { words: ["MIENTRAS", "TÚ", "NO", "ESTÁS?"], highlight: null },
];

export function Hero() {
  // En móvil el deck coordina el salto dentro del mismo bloque (scroll interno);
  // en escritorio degrada a scrollIntoView nativo.
  const scrollToSchedule = () => goToSchedule();

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
          {/* Credencial oficial: Meta Business Partner + WhatsApp API */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-3"
          >
            <img
              src="/img/meta-business-partner.png"
              alt="Funners — Meta Business Partner (credencial oficial de Meta)"
              width={150}
              height={86}
              loading="eager"
              decoding="async"
              className="h-auto w-[128px] sm:w-[150px]"
            />
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-wa"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 sm:text-xs">
                WhatsApp API
              </span>
            </span>
          </motion.div>

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
