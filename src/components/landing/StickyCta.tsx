"use client";

/**
 * CTA STICKY MÓVIL — barra fija inferior que SIEMPRE queda por encima
 * del deck de bloques. Respeta el safe-area de iOS. Cambia de estado:
 *  - Sin registrar: "RESERVAR MI LUGAR GRATIS" → va al calendario
 *    (en modo bloques: cambia de bloque y desplaza su contenido).
 *  - Registrado: abre WhatsApp directamente (re-activación).
 * Visible en modo deck cuando el calendario NO está a la vista
 * (bloques posteriores o contenido scrolleado) — el botón nunca se pierde.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, Zap } from "lucide-react";
import { buildWhatsAppLink, type RegistrationData } from "@/lib/whatsapp";
import { track, EVENTS } from "@/lib/tracking";
import { goToSchedule } from "@/lib/navigation";

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
  const [scheduleInView, setScheduleInView] = useState(false);
  const [pageScrolled, setPageScrolled] = useState(false); // escritorio
  const [deckIndex, setDeckIndex] = useState<number | null>(null); // modo bloques
  // Inicializador lazy: solo se renderiza cuando visible (scroll/deck),
  // por lo que no hay desajuste de hidratación.
  const [registration, setRegistration] = useState<RegistrationData | null>(() =>
    typeof window === "undefined" ? null : readTodayRegistration()
  );

  useEffect(() => {
    // Escritorio: aparición al hacer scroll de página
    const onScroll = () => setPageScrolled(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Modo bloques: aparición por índice de bloque (body.dataset.blockIndex)
    const onDeckChange = (e: Event) =>
      setDeckIndex((e as CustomEvent<{ index: number }>).detail?.index ?? 0);
    const syncDeckFromDom = () => {
      const idx = document.body.dataset.blockIndex;
      if (idx !== undefined) {
        onDeckChange(
          new CustomEvent("wa:deck-change", { detail: { index: Number(idx || 0) } })
        );
      }
    };
    syncDeckFromDom();
    window.addEventListener("wa:deck-change", onDeckChange);

    const observer = new IntersectionObserver(
      ([entry]) => setScheduleInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    const target = document.getElementById("reservar");
    if (target) observer.observe(target);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wa:deck-change", onDeckChange);
      observer.disconnect();
    };
  }, []);

  const deckActive = deckIndex !== null;
  // En modo deck: visible en bloques posteriores o si el calendario quedó
  // fuera de la vista dentro del bloque actual (botón siempre a mano).
  const visible = deckActive
    ? (deckIndex ?? 0) > 0 || !scheduleInView
    : pageScrolled;

  const show = visible && !scheduleInView && !registration;

  const openWhatsApp = () => {
    if (!registration) return;
    track(EVENTS.LEAD, { content_name: "sticky_reactivacion" });
    window.open(buildWhatsAppLink(registration), "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {show && (
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
                track("ScheduleOpen", { content_name: "sticky_cta" });
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

      {registration && visible && !scheduleInView && (
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
