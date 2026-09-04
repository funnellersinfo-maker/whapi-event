"use client";

/**
 * BLOCK DECK — Motor de navegación por BLOQUES en móvil.
 * ─────────────────────────────────────────────────────────────────
 * EXPERIENCIA: en pantallas < 1024px el sitio se convierte en una
 * pila de bloques de pantalla completa. Dentro de cada bloque SOLO
 * se puede mover el contenido ARRIBA/ABAJO (scroll interno vertical
 * nativo, sin scroll horizontal ni de página). El avance al bloque
 * siguiente ocurre al llegar al final del contenido (gesto swipe,
 * rueda del ratón, teclado, chevron "Desliza para continuar" o
 * puntos laterales). El botón de acción nunca se pierde: la barra
 * sticky inferior queda siempre por encima del deck.
 *
 * En ESCRITORIO el renderizado es idéntico al flujo normal
 * (main + footer), sin ningún comportamiento de deck.
 *
 * Comunicación: body.dataset.blockIndex + eventos "wa:deck-change"
 * (cambio de bloque) y "wa:deck-goto" (saltar a un elemento, p.ej.
 * #reservar desde un CTA de otro bloque).
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface BlockDeckProps {
  /** Secciones de contenido (main). Cada una = un bloque en móvil. */
  content: ReactNode[];
  /** Bloque final: cierre + footer. */
  footer: ReactNode;
  /** Etiquetas aria para cada bloque. */
  labels: string[];
}

const BLOCK_TRANSITION_MS = 500;

export function BlockDeck({ content, footer, labels }: BlockDeckProps) {
  const items = [...content, footer];
  const total = items.length;

  const [deckMode, setDeckMode] = useState(false);
  const [index, setIndex] = useState(0);
  const scrollers = useRef<(HTMLDivElement | null)[]>([]);
  const indexRef = useRef(0);
  const cooldownRef = useRef(0);
  const touchStart = useRef<{
    y: number;
    atTop: boolean;
    atBottom: boolean;
    fits: boolean;
  } | null>(null);

  /* ── Activación: solo móvil/tablet (< lg) ───────────────── */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => {
      const on = mq.matches;
      setDeckMode(on);
      document.documentElement.classList.toggle("deck-mode", on);
      if (on) {
        document.body.dataset.blockIndex = String(indexRef.current);
      } else {
        delete document.body.dataset.blockIndex;
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.classList.remove("deck-mode");
      delete document.body.dataset.blockIndex;
    };
  }, []);

  /* ── Cambio de bloque (con cooldown anti-rebote) ────────── */
  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      const now = Date.now();
      if (clamped === indexRef.current || now < cooldownRef.current) return;
      cooldownRef.current = now + 750;
      indexRef.current = clamped;
      setIndex(clamped);
      document.body.dataset.blockIndex = String(clamped);
      window.dispatchEvent(
        new CustomEvent("wa:deck-change", { detail: { index: clamped } })
      );
    },
    [total]
  );

  /* ── Teclado: flechas / AvPág / RePág ───────────────────── */
  useEffect(() => {
    if (!deckMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        go(indexRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        go(indexRef.current - 1);
      } else if (e.key === "Home") {
        go(0);
      } else if (e.key === "End") {
        go(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deckMode, go, total]);

  /* ── Saltos desde CTAs (goToSchedule) ───────────────────── */
  useEffect(() => {
    const onGoto = (ev: Event) => {
      const id = (ev as CustomEvent<{ id: string }>).detail?.id;
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      const bi = scrollers.current.findIndex(
        (sc) => sc && sc.contains(el)
      );
      if (bi < 0) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (bi === indexRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        go(bi);
        window.setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, BLOCK_TRANSITION_MS - 100);
      }
    };
    window.addEventListener("wa:deck-goto", onGoto);
    return () => window.removeEventListener("wa:deck-goto", onGoto);
  }, [go]);

  /* ── Gestos: edge detection del scroller activo ─────────── */
  const snapshotScroller = () => {
    const sc = scrollers.current[indexRef.current];
    if (!sc) return null;
    return {
      atTop: sc.scrollTop <= 4,
      atBottom: sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4,
      fits: sc.scrollHeight <= sc.clientHeight + 4,
    };
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const snap = snapshotScroller();
    if (!snap) return;
    touchStart.current = { y: e.touches[0].clientY, ...snap };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const st = touchStart.current;
    touchStart.current = null;
    if (!st) return;
    const dy = st.y - e.changedTouches[0].clientY; // > 0 = swipe hacia arriba = siguiente
    if (Math.abs(dy) < 56) return;
    if (dy > 0 && (st.fits || st.atBottom)) go(indexRef.current + 1);
    else if (dy < 0 && (st.fits || st.atTop)) go(indexRef.current - 1);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 12) return;
    const snap = snapshotScroller();
    if (!snap) return;
    if (e.deltaY > 0 && (snap.fits || snap.atBottom)) go(indexRef.current + 1);
    else if (e.deltaY < 0 && (snap.fits || snap.atTop))
      go(indexRef.current - 1);
  };

  /* ── ESCRITORIO: flujo normal, intacto ──────────────────── */
  if (!deckMode) {
    return (
      <>
        <main className="relative flex-1">{content}</main>
        {footer}
      </>
    );
  }

  /* ── MÓVIL: deck de bloques ─────────────────────────────── */
  return (
    <div
      data-block-deck
      aria-label="Contenido por bloques"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
      className="fixed inset-0 z-40 overflow-hidden"
    >
      {items.map((item, i) => {
        const active = i === index;
        const position =
          i === index
            ? "z-10 translate-y-0 opacity-100"
            : i < index
              ? "z-0 -translate-y-full opacity-0 pointer-events-none"
              : "z-0 translate-y-full opacity-0 pointer-events-none";
        return (
          <div
            key={i}
            data-block-active={active ? "" : undefined}
            role="group"
            aria-label={labels[i] ?? `Bloque ${i + 1}`}
            aria-hidden={!active}
            className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${position}`}
          >
            <div
              data-block-scroller
              ref={(el) => {
                scrollers.current[i] = el;
              }}
              className="h-full overflow-y-auto overscroll-contain"
            >
              <div className="flex min-h-full flex-col">
                {item}
                {i < total - 1 && (
                  <NextHint onClick={() => go(i + 1)} />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Indicador de progreso (puntos laterales) */}
      <nav
        aria-label="Progreso del contenido"
        className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-1.5"
      >
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Ir al bloque ${i + 1}${
              labels[i] ? `: ${labels[i]}` : ""
            }`}
            aria-current={i === index}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "h-5 bg-wa shadow-[0_0_8px_rgba(37,211,102,0.6)]"
                : "h-1.5 bg-white/25 hover:bg-white/60 active:bg-white/60"
            }`}
          />
        ))}
      </nav>
    </div>
  );
}

/* ── Chevron "Desliza para continuar" (final de cada bloque) ── */
function NextHint({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-auto flex flex-col items-center gap-1 pb-5 pt-8">
      <button
        type="button"
        onClick={onClick}
        aria-label="Continuar al siguiente bloque"
        className="flex flex-col items-center gap-0.5 rounded-2xl px-6 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white/80 active:text-white/90"
      >
        <span>Desliza para continuar</span>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-wa" aria-hidden="true" />
        </motion.span>
      </button>
    </div>
  );
}
