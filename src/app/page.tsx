"use client";

/**
 * LANDING — "CÓMO HACER QUE TU WHATSAPP VENDA POR TI 24/7"
 * Evento en vivo gratuito · Experiencia de pre-venta tipo SaaS premium.
 * 100% client-side (compatible con static export / Cloudflare Pages).
 */

import { ClientBoot } from "@/components/landing/ClientBoot";
import { TopBanner } from "@/components/landing/TopBanner";
import { Hero } from "@/components/landing/Hero";
import { IntrigueSection } from "@/components/landing/IntrigueSection";
import { FlowSection } from "@/components/landing/FlowSection";
import { AudienceSection, EventSection } from "@/components/landing/AudienceEventSections";
import { ScheduleSection } from "@/components/landing/ScheduleSection";
import { FomoSection, FinalSection } from "@/components/landing/FomoFinalSections";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";
import { StickyCta } from "@/components/landing/StickyCta";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

export default function Home() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-clip bg-background">
      <ClientBoot />
      <TopBanner />

      <main className="relative flex-1">
        <Hero />
        <IntrigueSection />
        <FlowSection />
        <AudienceSection />
        <EventSection />
        <ScheduleSection />
        <FomoSection />
        <FaqSection />
        <FinalSection />
      </main>

      <Footer />
      <StickyCta />
      <FloatingWhatsApp />
    </div>
  );
}
