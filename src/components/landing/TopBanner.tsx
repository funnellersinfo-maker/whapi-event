"use client";

/**
 * BANNER SUPERIOR — Marco de oportunidad 2027 (no miedo artificial).
 * Marquee sutil con el mensaje central siempre visible.
 */

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function TopBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-40 overflow-hidden border-b border-wa/15 bg-gradient-to-r from-wa-deep/50 via-ink to-wa-deep/50"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-wa/8 to-transparent" />
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-4 py-2.5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 sm:text-xs">
          <span className="text-wa-glow">2027 ya viene.</span>{" "}
          <span className="hidden sm:inline">
            ¿Tu negocio va a seguir vendiendo con un WhatsApp manual?
          </span>
          <span className="sm:hidden">¿Seguirás vendiendo manual?</span>
        </p>
      </div>
    </motion.div>
  );
}

export function ScrollHint() {
  return (
    <motion.a
      href="#descubrir"
      aria-label="Bajar a la siguiente sección"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, 8, 0] }}
      transition={{ delay: 1.6, y: { repeat: Infinity, duration: 2.2 } }}
      className="mx-auto hidden h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5 lg:flex"
    >
      <span className="h-2 w-1 rounded-full bg-wa/70" />
      <ArrowDown className="sr-only" />
    </motion.a>
  );
}
