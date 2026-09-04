"use client";

/**
 * SECCIÓN "PERO HAY ALGO MÁS" — Impacto visual + diagrama del flujo real:
 * META ADS → WHATSAPP → IA → SEGUIMIENTO → VENTA
 * Pulso animado recorriendo las conexiones (versión horizontal desktop,
 * vertical móvil). Se siente como una mini interfaz del sistema en vivo.
 */

import { motion } from "framer-motion";
import { Megaphone, MessageCircle, Cpu, BellRing, TrendingUp } from "lucide-react";

const FLOW = [
  { icon: Megaphone, label: "META ADS", sub: "Tráfico que ya tienes pagando" },
  { icon: MessageCircle, label: "WHATSAPP", sub: "El cliente llega y conversa" },
  { icon: Cpu, label: "IA", sub: "La conversación se atiende sola" },
  { icon: BellRing, label: "SEGUIMIENTO", sub: "Nadie se enfría ni se pierde" },
  { icon: TrendingUp, label: "VENTA", sub: "La conversación se convierte" },
];

export function FlowSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Fondo dramático */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_110%,rgba(37,211,102,0.14),transparent),radial-gradient(ellipse_40%_50%_at_10%_50%,rgba(0,229,160,0.05),transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-wa/15 to-transparent lg:block"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-wa/70"
        >
          PERO HAY ALGO MÁS
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-balance text-center text-3xl font-bold leading-tight text-white sm:text-4xl"
        >
          Y esto es lo que{" "}
          <span className="relative inline-block">
            <span className="relative z-10">casi nadie te muestra…</span>
            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-1 z-0 h-2 origin-left bg-wa/25"
            />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/70 sm:text-xl"
        >
          Te enseñaremos el sistema{" "}
          <strong className="font-bold text-wa-glow text-glow-wa">
            funcionando EN VIVO.
          </strong>
        </motion.p>

        {/* ── Diagrama de flujo ── */}
        <div className="relative mt-16">
          {/* Conectores horizontales (desktop) */}
          <div aria-hidden="true" className="absolute inset-x-16 top-8 hidden lg:block">
            <div className="relative h-0.5 w-full bg-gradient-to-r from-white/10 via-wa/30 to-wa/50">
              <motion.span
                className="absolute -top-[3px] h-2 w-2 rounded-full bg-wa-glow glow-wa-sm"
                animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute -top-[3px] h-2 w-2 rounded-full bg-wa glow-wa-sm"
                animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.1,
                }}
              />
            </div>
          </div>

          {/* Conector vertical (móvil/tablet) */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-8 top-6 w-0.5 bg-gradient-to-b from-white/10 via-wa/25 to-wa/45 lg:hidden"
          >
            <motion.span
              className="absolute -left-[3px] h-2 w-2 rounded-full bg-wa-glow glow-wa-sm"
              animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <ol className="relative grid gap-6 lg:grid-cols-5 lg:gap-4">
            {FLOW.map((node, i) => (
              <motion.li
                key={node.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
              >
                <div className="relative shrink-0">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
                      i === FLOW.length - 1
                        ? "border-wa/50 bg-wa/15 glow-wa"
                        : "glass-strong"
                    }`}
                  >
                    <node.icon
                      className={`h-6 w-6 ${i === FLOW.length - 1 ? "text-wa-glow" : "text-wa"}`}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-wa text-[10px] font-bold text-[#04120a]">
                    {i + 1}
                  </span>
                </div>
                <div className="lg:mt-5">
                  <p className="text-sm font-bold tracking-wide text-white">
                    {node.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50 lg:mt-2">
                    {node.sub}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>

          {/* Etiqueta "EN VIVO" sobre el flujo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mx-auto mt-12 flex w-fit items-center gap-2 rounded-full border border-wa/30 bg-wa/8 px-5 py-2.5"
          >
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[#ff4d4d]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              El sistema completo · Funcionando en tiempo real
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
