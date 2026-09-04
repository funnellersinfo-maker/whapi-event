"use client";

/**
 * PARA QUIÉN ES — Etiquetas de industrias + checklist del evento.
 * Dos secciones compactas, poco texto, máxima claridad.
 */

import { motion } from "framer-motion";
import {
  ShoppingBag,
  HeartPulse,
  Briefcase,
  UtensilsCrossed,
  Stethoscope,
  UserRound,
  MapPin,
  Check,
} from "lucide-react";

const INDUSTRIES = [
  { icon: ShoppingBag, label: "E-commerce" },
  { icon: HeartPulse, label: "Salud y bienestar" },
  { icon: Briefcase, label: "Servicios" },
  { icon: UtensilsCrossed, label: "Restaurantes" },
  { icon: Stethoscope, label: "Clínicas" },
  { icon: UserRound, label: "Profesionales" },
  { icon: MapPin, label: "Negocios locales" },
];

const EVENT_POINTS = [
  "Cómo funciona un Agente IA dentro de WhatsApp",
  "Cómo responde y conversa con clientes",
  "Cómo puede entender audios, imágenes y archivos",
  "Cómo automatizar seguimientos",
  "Cómo conectar tráfico de Meta Ads con WhatsApp",
  "Cómo convertir WhatsApp en un sistema comercial",
];

export function AudienceSection() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-balance text-center text-2xl font-bold leading-tight text-white sm:text-3xl"
        >
          Si tu negocio recibe clientes por WhatsApp,{" "}
          <span className="text-gradient-wa">esto es para ti.</span>
        </motion.h2>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {INDUSTRIES.map((ind, i) => (
            <motion.span
              key={ind.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-white/80 transition-colors duration-300 hover:border-wa/40 hover:text-white"
            >
              <ind.icon className="h-4 w-4 text-wa/80" aria-hidden="true" />
              {ind.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EventSection() {
  return (
    <section className="relative py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_100%,rgba(37,211,102,0.08),transparent)]"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          EN EL EVENTO <span className="text-gradient-wa">VERÁS:</span>
        </motion.h2>

        <ul className="mt-12 grid gap-3.5 sm:grid-cols-2">
          {EVENT_POINTS.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass card-lift flex items-center gap-3.5 rounded-2xl px-5 py-4"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wa/15">
                <Check className="h-3.5 w-3.5 text-wa" strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="text-sm leading-snug text-white/85">{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
