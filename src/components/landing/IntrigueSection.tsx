"use client";

/**
 * SECCIÓN DE INTRIGA — "Lo que vas a descubrir…"
 * 4 tarjetas visuales con iconografía minimalista, glassmorphism,
 * stagger reveal al hacer scroll y hover con glow.
 */

import { motion } from "framer-motion";
import { Bot, Crosshair, RefreshCcw, Banknote } from "lucide-react";

const CARDS = [
  {
    icon: Bot,
    title: "RESPUESTA INSTANTÁNEA",
    text: "Tu negocio responde incluso cuando tú estás ocupado.",
  },
  {
    icon: Crosshair,
    title: "PROSPECTOS CALIFICADOS",
    text: "La IA identifica quién realmente tiene intención de comprar.",
  },
  {
    icon: RefreshCcw,
    title: "SEGUIMIENTO AUTOMÁTICO",
    text: "Las conversaciones no terminan cuando el cliente deja de responder.",
  },
  {
    icon: Banknote,
    title: "VENTAS 24/7",
    text: "Convierte conversaciones en oportunidades mientras tú haces otras cosas.",
  },
];

export function IntrigueSection() {
  return (
    <section id="descubrir" className="relative py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(37,211,102,0.06),transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-balance text-center text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[2.75rem]"
        >
          Lo que vas a <span className="text-gradient-wa">descubrir</span> puede
          cambiar la forma en que atiendes y vendes.
        </motion.h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass card-lift group relative overflow-hidden rounded-3xl p-6"
            >
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-wa/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-wa/25 bg-wa/10 transition-transform duration-300 group-hover:scale-110">
                  <card.icon
                    className="h-5.5 w-5.5 text-wa"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-5 text-sm font-bold tracking-wide text-white">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/55">
                  {card.text}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
