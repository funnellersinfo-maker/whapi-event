"use client";

/**
 * TRACKING — Meta Pixel ACTIVO (pixelId en src/config/site.ts).
 * El código oficial (init + PageView) vive en el layout y corre al
 * parsear el HTML. Este módulo garantiza que fbq exista (idempotente)
 * y expone el disparo de eventos de los botones.
 *
 * POLÍTICA DE EVENTOS: los CTA de la landing disparan únicamente
 * "Lead" (clientes potenciales). Ni ViewContent ni otros eventos.
 */

import { SITE_CONFIG } from "@/config/site";

type FbqFn = ((...args: unknown[]) => void) & {
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    __fbqLoaded?: boolean;
  }
}

/** Carga del pixel (idempotente) — el snippet oficial ya corre en el
 * layout desde el parseo del HTML; esto es un respaldo que garantiza
 * el stub/cola si aún no existe (nunca produce doble init). */
export function ensurePixel(): void {
  if (typeof window === "undefined") return;
  const pixelId = SITE_CONFIG.tracking.pixelId;
  if (!pixelId || window.__fbqLoaded) return;
  window.__fbqLoaded = true;

  const w = window;
  if (w.fbq) return;

  // Stub compatible con el contrato de fbevents.js: cola + _fbq
  const queue: unknown[][] = [];
  const fbq: FbqFn = Object.assign(
    (...args: unknown[]) => {
      // Si el script real ya tomó el control, la cola la procesa él.
      if (w.fbq && w.fbq !== fbq) {
        w.fbq(...args);
        return;
      }
      queue.push(args);
    },
    { queue, loaded: true, version: "2.0" }
  );

  w.fbq = fbq;
  if (w._fbq === undefined) {
    (w as Window & { _fbq?: FbqFn })._fbq = fbq;
  }

  // Inyectar el script oficial una sola vez
  if (!document.querySelector("script[data-fbp]")) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.fbp = "1";
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(script, first);
  }

  fbq("init", pixelId);
  fbq("track", "PageView");
}

/** Dispara un evento estándar/custom de Meta con datos opcionales */
export function track(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!SITE_CONFIG.tracking.pixelId) return;
  try {
    window.fbq?.("track", event, data ?? {});
  } catch {
    /* tracking nunca debe romper la UX */
  }
}

/** Dispara "Lead" (cliente potencial) — el único evento de botones */
export function trackLead(
  contentName: string,
  data?: Record<string, unknown>
): void {
  track("Lead", { content_name: contentName, ...data });
}

/** Evento único usado por los CTA de la landing */
export const EVENTS = {
  LEAD: "Lead", // cliente potencial — único evento de botones
} as const;
