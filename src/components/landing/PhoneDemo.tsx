"use client";

/**
 * DEMO DEL AGENTE IA — Simulación elegante y animada de una conversación
 * real de WhatsApp: un cliente pregunta, la IA recomienda, resuelve
 * objeciones y guía hacia la compra. Secuencia con typing indicators,
 * burbujas WhatsApp auténticas, tarjeta de producto y cierre de venta
 * "a las 3:12 AM" (sin intervención humana).
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Check, CheckCheck, Lock, Sparkles } from "lucide-react";

type MsgKind = "text" | "product" | "summary";

interface ChatMsg {
  id: number;
  from: "in" | "out";
  kind: MsgKind;
  text?: string;
  time: string;
}

const SCRIPT: { delay: number; typing?: number; msg: ChatMsg }[] = [
  {
    delay: 700,
    msg: { id: 1, from: "in", kind: "text", text: "Hola, ¿tienen el Sérum Nocturno Glow disponible?", time: "03:09" },
  },
  {
    delay: 300,
    typing: 1500,
    msg: {
      id: 2,
      from: "out",
      kind: "text",
      text: "¡Hola Camila! Sí, lo tenemos disponible ahora mismo. Te comparto los detalles:",
      time: "03:09",
    },
  },
  {
    delay: 350,
    msg: { id: 3, from: "out", kind: "product", time: "03:10" },
  },
  {
    delay: 2600,
    msg: { id: 4, from: "in", kind: "text", text: "¿Tiene garantía? Es mi primera compra por WhatsApp.", time: "03:11" },
  },
  {
    delay: 300,
    typing: 1600,
    msg: {
      id: 5,
      from: "out",
      kind: "text",
      text: "Sí — 30 días de garantía sin preguntas. Más de 1.200 clientas lo repiten cada mes. ¿Te lo aparto ahora con envío a Medellín?",
      time: "03:11",
    },
  },
  {
    delay: 2000,
    msg: { id: 6, from: "in", kind: "text", text: "Sí, apartámelo", time: "03:12" },
  },
  {
    delay: 300,
    typing: 1400,
    msg: { id: 7, from: "out", kind: "summary", time: "03:12" },
  },
];

const RESET_PAUSE = 6500;

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bubble-out ml-auto flex w-fit items-center gap-1.5 px-4 py-3"
      aria-label="El agente IA está escribiendo"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-white/80"
          style={{
            animation: `typing 1.2s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </motion.div>
  );
}

function MetaRow({ time, read }: { time: string; read?: boolean }) {
  return (
    <span className="flex select-none items-center gap-1 text-[10px] leading-none text-white/40">
      {time}
      {read ? (
        <CheckCheck className="h-3 w-3 text-sky-300" aria-hidden="true" />
      ) : (
        <Check className="h-3 w-3" aria-hidden="true" />
      )}
    </span>
  );
}

export function PhoneDemo() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [closed, setClosed] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const run = () => {
      clearTimers();
      setMessages([]);
      setTyping(false);
      setClosed(false);

      let elapsed = 0;
      SCRIPT.forEach((step) => {
        elapsed += step.delay;
        if (step.typing) {
          timers.current.push(
            setTimeout(() => setTyping(true), elapsed)
          );
          elapsed += step.typing;
          timers.current.push(
            setTimeout(() => {
              setTyping(false);
              setMessages((m) => [...m, step.msg]);
            }, elapsed)
          );
        } else {
          timers.current.push(
            setTimeout(() => {
              setMessages((m) => [...m, step.msg]);
            }, elapsed)
          );
        }
      });

      elapsed += 1800;
      timers.current.push(setTimeout(() => setClosed(true), elapsed));
      elapsed += RESET_PAUSE;
      timers.current.push(setTimeout(run, elapsed));
    };

    run();
    return clearTimers;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, closed]);

  return (
    <div className="relative mx-auto w-full max-w-[340px] select-none">
      {/* Glow ambiental detrás del teléfono */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[48px] bg-gradient-to-b from-wa/18 via-wa/6 to-transparent blur-2xl"
      />

      {/* Chips flotantes (desktop) */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        className="glass absolute -left-24 top-24 z-10 hidden animate-float items-center gap-2 rounded-2xl px-4 py-2.5 lg:flex"
      >
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-wa" />
        <span className="text-xs font-medium text-white/80">Respuesta en 1.8s</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.7 }}
        className="glass absolute -right-24 top-52 z-10 hidden animate-float-slow items-center gap-2 rounded-2xl px-4 py-2.5 lg:flex"
      >
        <span className="text-xs font-semibold text-wa">+38%</span>
        <span className="text-xs text-white/60">conversión</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3, duration: 0.7 }}
        className="glass absolute -left-20 bottom-24 z-10 hidden animate-float items-center gap-2 rounded-2xl px-4 py-2.5 lg:flex"
        style={{ animationDelay: "1.4s" }}
      >
        <Bot className="h-3.5 w-3.5 text-wa-glow" aria-hidden="true" />
        <span className="text-xs text-white/70">Agente activo 24/7</span>
      </motion.div>

      {/* Teléfono */}
      <div className="phone-notch-shadow relative rounded-[44px] border border-white/10 bg-[#070d0a] p-[10px]">
        <div className="relative overflow-hidden rounded-[36px] bg-[#0b1210]">
          {/* Status bar */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-3 text-[10px] font-medium text-white/70">
            <span>3:12</span>
            <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black/90" />
            <div className="flex items-center gap-1.5">
              <Lock className="h-2.5 w-2.5" aria-hidden="true" />
              <span className="tracking-tighter">▪▪▪</span>
              <span className="ml-0.5 inline-block h-2.5 w-5 rounded-sm border border-white/50">
                <span className="block h-full w-3/4 rounded-[1px] bg-white/70" />
              </span>
            </div>
          </div>

          {/* Header WhatsApp */}
          <div className="relative z-10 flex items-center gap-3 border-b border-white/6 bg-[#0e1a14]/95 px-4 py-2.5 backdrop-blur">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-wa to-wa-teal text-sm font-bold text-[#04120a]">
                A
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0e1a14] bg-wa" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-white">
                Aurora · Asistente IA
              </p>
              <p className="text-[10px] text-wa/80">en línea · responde al instante</p>
            </div>
            <Sparkles className="h-4 w-4 text-wa/60" aria-hidden="true" />
          </div>

          {/* Área de chat */}
          <div
            ref={scrollRef}
            className="scroll-slim relative h-[380px] space-y-2.5 overflow-y-auto bg-[#0b1210] px-3 py-4 sm:h-[420px]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
            aria-label="Demostración de conversación con agente IA"
          >
            <div className="mx-auto w-fit rounded-lg bg-[#111d17] px-3 py-1.5 text-center text-[10px] text-white/45">
              Hoy
            </div>

            <AnimatePresence initial={false}>
              {messages.map((m) => {
                if (m.from === "out") {
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="flex justify-end"
                    >
                      {m.kind === "product" ? (
                        <ProductCard time={m.time} />
                      ) : m.kind === "summary" ? (
                        <SummaryCard time={m.time} />
                      ) : (
                        <div className="bubble-out max-w-[82%] px-3.5 py-2.5">
                          <p className="text-[13px] leading-snug text-white/95">{m.text}</p>
                          <div className="mt-1 flex justify-end">
                            <MetaRow time={m.time} read />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                }
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="flex justify-start"
                  >
                    <div className="bubble-in max-w-[82%] px-3.5 py-2.5">
                      <p className="text-[13px] leading-snug text-white/90">{m.text}</p>
                      <div className="mt-1 flex justify-end">
                        <MetaRow time={m.time} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {typing && <TypingBubble key="typing" />}
            </AnimatePresence>

            {/* Cierre de venta */}
            <AnimatePresence>
              {closed && (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glow-wa mx-auto mt-4 flex w-fit items-center gap-2 rounded-xl border border-wa/40 bg-wa/10 px-4 py-2.5"
                >
                  <CheckCheck className="h-4 w-4 text-wa" aria-hidden="true" />
                  <p className="text-[11px] font-semibold tracking-wide text-wa">
                    VENTA CERRADA · 03:12 AM · SIN INTERVENCIÓN HUMANA
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Barra de entrada */}
          <div className="relative z-10 flex items-center gap-2 border-t border-white/6 bg-[#0e1a14] px-3 py-2.5">
            <div className="flex h-9 flex-1 items-center rounded-full bg-[#131f18] px-4 text-[12px] text-white/35">
              Escribe un mensaje…
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-wa">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#04120a]" aria-hidden="true">
                <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ time }: { time: string }) {
  return (
    <div className="bubble-out w-[78%] overflow-hidden">
      <div className="relative h-36 w-full overflow-hidden">
        {/* Fallback elegante si la imagen no carga */}
        <div className="absolute inset-0 bg-gradient-to-br from-wa-deep to-[#0a6b5e]" />
        <img
          src="/img/product-serum.png"
          alt="Sérum Nocturno Glow — producto recomendado por el agente IA"
          loading="lazy"
          width={280}
          height={160}
          className="relative h-36 w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className="px-3.5 pb-2.5 pt-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[13px] font-semibold text-white">Sérum Nocturno Glow</p>
          <p className="text-[13px] font-bold text-wa-glow">$89.900</p>
        </div>
        <p className="mt-0.5 text-[11px] text-white/55">
          7 unidades disponibles · Envío mañana
        </p>
        <div className="mt-2.5 flex items-center justify-between rounded-lg border border-wa/30 bg-wa/10 px-3 py-2">
          <span className="text-[11px] font-semibold text-wa-glow">
            Apartar ahora
          </span>
          <MetaRow time={time} read />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ time }: { time: string }) {
  return (
    <div className="bubble-out w-[82%] px-3.5 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-wa-glow">
        Pedido apartado
      </p>
      <div className="mt-2 space-y-1 text-[12px] text-white/85">
        <div className="flex justify-between gap-3">
          <span className="text-white/60">Sérum Nocturno Glow ×1</span>
          <span>$89.900</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-white/60">Envío · Medellín</span>
          <span className="text-wa-glow">Gratis</span>
        </div>
        <div className="my-1.5 h-px bg-white/15" />
        <div className="flex justify-between gap-3 font-semibold">
          <span>Total</span>
          <span>$89.900</span>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-center rounded-lg bg-wa py-2 text-[11px] font-bold text-[#04120a]">
        Pagar por link seguro
      </div>
      <div className="mt-1.5 flex justify-end">
        <MetaRow time={time} read />
      </div>
    </div>
  );
}
