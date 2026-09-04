"use client";

/**
 * BOOT CLIENTE — se monta una sola vez en el layout de la página.
 * 1) Inicializa Meta Pixel si hay pixelId configurado.
 * 2) Bloquea pinch-zoom y double-tap zoom en iOS/Android para que
 *    el sitio se sienta como una app nativa (100% estático en móvil).
 */

import { useEffect } from "react";
import { ensurePixel, track, EVENTS } from "@/lib/tracking";

export function ClientBoot() {
  useEffect(() => {
    ensurePixel();
    track(EVENTS.VIEW_CONTENT, {
      content_name: "landing_evento_whatsapp_ia",
    });

    // ── Bloqueo de gestos de zoom (iOS) ──
    const preventGesture = (e: Event) => e.preventDefault();

    // ── Bloqueo de double-tap zoom ──
    let lastTouchEnd = 0;
    const preventDoubleTap = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 320) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener("gesturestart", preventGesture, {
      passive: false,
    } as AddEventListenerOptions);
    document.addEventListener("gesturechange", preventGesture, {
      passive: false,
    } as AddEventListenerOptions);
    document.addEventListener("touchend", preventDoubleTap, {
      passive: false,
    } as AddEventListenerOptions);

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("touchend", preventDoubleTap);
    };
  }, []);

  return null;
}
