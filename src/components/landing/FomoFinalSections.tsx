"use client";

/**
 * FOMO + BLOQUE FINAL — Urgencia real (cupos limitados) y cierre
 * con la pregunta competitiva. Poco texto, mucho impacto.
 */

import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert, TrendingUp } from "lucide-react";
import { HeroCta } from "./Hero";
import { ParticleField } from "./ParticleField";

function scrollToSchedule() {
  document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
}

export function FomoSection() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-amber-warn/25 bg-gradient-to-br from-[#1a1206]/80 via-ink-2 to-ink-2 p-8 text-center sm:p-12"
        >
          <div
            aria-hidden="true"
            className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-amber-warn/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-amber-warn/8 blur-3xl"
          />

          <div className="relative">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3.4 }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-warn/40 bg-amber-warn/10"
            >
              <ShieldAlert className="h-7 w-7 text-amber-warn" aria-hidden="true" />
            </motion.div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span className="text-amber-warn">NO TE QUEDES FUERA</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-balance text-white/65">
              Las demostraciones son <strong className="text-white">en vivo</strong> y
              trabajamos con <strong className="text-white">cupos limitados</strong>.
            </p>

            <div className="mt-8">
              <FomoCta />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FomoCta() {
  return (
    <button
      type="button"
      onClick={scrollToSchedule}
      aria-label="Reservar mi lugar gratis ahora"
      className="group inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-amber-warn px-8 py-4 text-base font-bold uppercase tracking-wide text-[#1a1206] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] sm:w-auto sm:min-w-[300px]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      <span className="relative">RESERVAR MI LUGAR GRATIS</span>
      <ArrowRight
        className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
        aria-hidden="true"
      />
    </button>
  );
}

export function FinalSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Cierre dramático con glow central */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_55%,rgba(37,211,102,0.13),transparent)]"
      />
      <ParticleField density={36} />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-wa/30 bg-wa/10 glow-wa"
        >
          <TrendingUp className="h-8 w-8 text-wa" aria-hidden="true" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 text-balance text-3xl font-bold leading-[1.15] text-white sm:text-4xl md:text-5xl"
        >
          Tu competencia ya está automatizando.
          <span className="mt-3 block text-white/70">
            La pregunta es:{" "}
            <span className="text-gradient-wa text-glow-wa">
              ¿cuándo vas a empezar tú?
            </span>
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10"
        >
          <HeroCta
            onClick={scrollToSchedule}
            label="QUIERO VER LA DEMO GRATIS"
          />
        </motion.div>
      </div>
    </section>
  );
}
