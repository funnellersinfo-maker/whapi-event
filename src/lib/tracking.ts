"use client";

/**
 * TRACKING — Meta Pixel / CAPI listo para activar
 * ───────────────────────────────────────────────
 * Pega tu pixelId en src/config/site.ts → todos los eventos
 * empiezan a dispararse automáticamente. Sin pixelId → no-op.
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

/** Carga asíncrona del pixel (una sola vez) — stub moderno, sin arguments/apply */
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

/** Eventos usados por la landing (documentación de flujo) */
export const EVENTS = {
  VIEW_CONTENT: "ViewContent", // llegó a la landing
  SCHEDULE_SELECT: "ScheduleSelect", // eligió horario (custom)
  INITIATE_CHECKOUT: "InitiateCheckout", // completó el registro
  LEAD: "Lead", // activó su experiencia en WhatsApp
} as const;
