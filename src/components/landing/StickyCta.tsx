"use client";

/**
 * CTA STICKY MÓVIL — barra fija inferior que SIEMPRE queda por encima
 * del deck de bloques. Respeta el safe-area de iOS.
 *
 * APARICIÓN INTELIGENTE (regla de scroll):
 *  - NO aparece al cargar la página.
 *  - Aparece con el PRIMER SCROLL (contenido del bloque actual se
 *    desplaza, o el usuario cambia de bloque).
 *  - Desaparece al volver al punto más arriba (inicial): bloque 1
 *    con su contenido arriba del todo, o scrollY ≈ 0 en escritorio.
 *
 * Estados del botón:
 *  - Sin registrar: "RESERVAR MI LUGAR GRATIS" → va al calendario.
 *  - Registrado: abre WhatsApp directamente (re-activación).
 * Ambos clics disparan Lead (cliente potencial) en el Meta Pixel.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, Zap } from "lucide-react";
import { buildWhatsAppLink, type RegistrationData } from "@/lib/whatsapp";
import { trackLead } from "@/lib/tracking";
import { goToSchedule } from "@/lib/navigation";

/** Umbral con histéresis: aparece al superarlo, se oculta al bajar de HIDE */
const SHOW_AT = 28;
const HIDE_AT = 10;

function readTodayRegistration(): RegistrationData | null {
  try {
    const raw = window.localStorage.getItem("wa_event_bookings_v1");
    if (!raw) return null;
    const list = JSON.parse(raw) as Array<
      RegistrationData & { dateKey: string }
    >;
    const today = new Date();
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const found = [...list].reverse().find((b) => b.dateKey === key);
    return found ? { ...found, day: "hoy" } : null;
  } catch {
    return null;
  }
}

export function StickyCta() {
  // ¿El usuario ya hizo scroll (primer gesto)? — false al cargar.
  const [scrolled, setScrolled] = useState(false);
  // Índice de bloque actual (modo bloques móvil); null = escritorio.
  const [deckIndex, setDeckIndex] = useState<number | null>(null);
  // Inicializador lazy: solo se renderiza cuando visible (scroll/deck),
  // por lo que no hay desajuste de hidratación.
  const [registration, setRegistration] = useState<RegistrationData | null>(() =>
    typeof window === "undefined" ? null : readTodayRegistration()
  );

  // Refs espejo para leer estado fresco dentro de listeners pasivos.
  const scrolledRef = useRef(false);
  const deckIndexRef = useRef<number | null>(null);

  const setScrolledState = (next: boolean) => {
    if (next === scrolledRef.current) return;
    scrolledRef.current = next;
    setScrolled(next);
  };

  /** Aplica la histéresis sobre la posición vertical dada */
  const applyTop = (top: number) => {
    setScrolledState(
      scrolledRef.current ? top > HIDE_AT : top > SHOW_AT
    );
  };

  /** Reevalúa: ¿está el usuario "abajo" (scrolled) o de vuelta arriba? */
  const evaluate = () => {
    if (deckIndexRef.current !== null) {
      // MODO BLOQUES: cualquier bloque posterior cuenta como scroll;
      // en el bloque 1 manda la posición de su contenido interno.
      if (deckIndexRef.current > 0) {
        setScrolledState(true);
        return;
      }
      const sc = document.querySelector<HTMLElement>(
        "div[data-block-active] div[data-block-scroller]"
      );
      applyTop(sc ? sc.scrollTop : 0);
    } else {
      // ESCRITORIO (fallback): scroll de página.
      applyTop(window.scrollY);
    }
  };

  useEffect(() => {
    // Cambio de bloque: actualizar índice y reevaluar tras el repintado
    // (el atributo data-block-active se actualiza en el render de React).
    const onDeckChange = (e: Event) => {
      const idx = (e as CustomEvent<{ index: number }>).detail?.index ?? 0;
      deckIndexRef.current = idx;
      setDeckIndex(idx);
      requestAnimationFrame(() => requestAnimationFrame(evaluate));
    };
    const syncDeckFromDom = () => {
      const idx = document.body.dataset.blockIndex;
      if (idx !== undefined) {
        deckIndexRef.current = Number(idx || 0);
        setDeckIndex(deckIndexRef.current);
      } else {
        deckIndexRef.current = null;
        setDeckIndex(null);
      }
    };
    syncDeckFromDom();
    // Estado inicial diferido al próximo frame (arriba → oculta) y sin
    // setState síncrono dentro del efecto.
    requestAnimationFrame(evaluate);

    // Scroll en FASE DE CAPTURA: captura el scroll del scroller del
    // bloque activo (los eventos de scroll no burbujean) y el de página.
    const onScrollCapture = () => evaluate();
    document.addEventListener("scroll", onScrollCapture, { passive: true, capture: true });

    window.addEventListener("wa:deck-change", onDeckChange);

    return () => {
      document.removeEventListener("scroll", onScrollCapture, true);
      window.removeEventListener("wa:deck-change", onDeckChange);
    };
  }, []);

  const openWhatsApp = () => {
    if (!registration) return;
    trackLead("sticky_reactivacion");
    window.open(buildWhatsAppLink(registration), "_blank", "noopener,noreferrer");
  };

  const showReservar = scrolled && !registration;
  const showWhatsApp = scrolled && !!registration;

  return (
    <AnimatePresence>
      {showReservar && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="glass-strong mx-auto flex max-w-lg items-center gap-3 border-t border-wa/20 px-4 py-3">
            <button
              type="button"
              onClick={() => {
                trackLead("sticky_reservar");
                goToSchedule();
              }}
              className="group relative flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-wa text-sm font-bold uppercase tracking-wide text-[#04120a] transition-transform active:scale-[0.98]"
              aria-label="Reservar mi lugar gratis ahora"
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              RESERVAR MI LUGAR GRATIS
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}

      {showWhatsApp && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="glass-strong mx-auto flex max-w-lg items-center gap-3 border-t border-wa/20 px-4 py-3">
            <button
              type="button"
              onClick={openWhatsApp}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-wa text-sm font-bold uppercase tracking-wide text-[#04120a] transition-transform active:scale-[0.98]"
              aria-label="Abrir WhatsApp con tu experiencia activada"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              ABRIR MI WHATSAPP
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
