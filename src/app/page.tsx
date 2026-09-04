"use client";

/**
 * LANDING — "CÓMO HACER QUE TU WHATSAPP VENDA POR TI 24/7"
 * Evento en vivo gratuito · Experiencia de pre-venta tipo SaaS premium.
 * 100% client-side (compatible con static export / Cloudflare Pages).
 *
 * MÓVIL: BlockDeck convierte el sitio en bloques de pantalla completa
 * con scroll interno vertical (único movimiento permitido) y avance
 * al terminar cada bloque. ESCRITORIO: flujo normal.
 */

import { Fragment } from "react";
import { ClientBoot } from "@/components/landing/ClientBoot";
import { BlockDeck } from "@/components/landing/BlockDeck";
import { TopBanner } from "@/components/landing/TopBanner";
import { Hero } from "@/components/landing/Hero";
import { IntrigueSection } from "@/components/landing/IntrigueSection";
import { FlowSection } from "@/components/landing/FlowSection";
import { AudienceSection, EventSection } from "@/components/landing/AudienceEventSections";
import { FomoSection, FinalSection } from "@/components/landing/FomoFinalSections";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";
import { StickyCta } from "@/components/landing/StickyCta";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

const CONTENT_BLOCKS = [
  // Bloque 1: hook + calendario de conversión + demo (el botón nunca se pierde)
  <Fragment key="hero">
    <TopBanner />
    <Hero />
  </Fragment>,
  <IntrigueSection key="intrigue" />,
  <FlowSection key="flow" />,
  <AudienceSection key="audience" />,
  <EventSection key="event" />,
  <FomoSection key="fomo" />,
  <FaqSection key="faq" />,
];

const FOOTER_BLOCK = (
  <Fragment key="final">
    <FinalSection />
    <Footer />
  </Fragment>
);

const BLOCK_LABELS = [
  "Reserva tu sesión",
  "Lo que vas a descubrir",
  "Cómo funciona el sistema",
  "Para quién es",
  "En el evento verás",
  "Cupos limitados",
  "Preguntas frecuentes",
  "Empieza ahora",
];

export default function Home() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-clip bg-background">
      <ClientBoot />

      <BlockDeck
        content={CONTENT_BLOCKS}
        footer={FOOTER_BLOCK}
        labels={BLOCK_LABELS}
      />

      <StickyCta />
      <FloatingWhatsApp />
    </div>
  );
}
