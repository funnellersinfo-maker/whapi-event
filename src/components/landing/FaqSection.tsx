"use client";

/**
 * FAQ — Resuelve objeciones justo antes del cierre.
 * Acordeón animado, solo una pregunta abierta a la vez.
 */

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "¿El evento es realmente gratuito?",
    a: "Sí. El acceso al evento en vivo es 100% gratuito. Solo necesitas reservar tu cupo eligiendo un horario — así te aseguramos una experiencia personalizada y sin multitudes.",
  },
  {
    q: "¿Necesito conocimientos técnicos para entenderlo?",
    a: "No. Todo se muestra funcionando en pantalla, paso a paso y en español. Si sabes usar WhatsApp, vas a entender cada parte del sistema.",
  },
  {
    q: "¿Cómo accedo al evento una vez que reservo?",
    a: "Al reservar activas tu experiencia en WhatsApp: la IA te recibe, confirma tu cupo y te entrega el acceso a la sesión en vivo. Todo llega directo a tu WhatsApp, sin correos ni enlaces raros.",
  },
  {
    q: "¿Qué pasa si no puedo asistir al horario que elegí?",
    a: "Puedes volver a esta página y reservar otro horario disponible del día, o escribirnos por WhatsApp y te reubicamos en la próxima sesión con cupo.",
  },
  {
    q: "¿Mi negocio sirve para esto?",
    a: "Si tus clientes te escriben por WhatsApp — e-commerce, salud, servicios, restaurantes, clínicas o cualquier negocio local — el sistema aplica directo. En el evento verás casos de cada tipo.",
  },
  {
    q: "¿Van a intentar venderme algo al final?",
    a: "Vamos a mostrarte el sistema funcionando en vivo y al final habrá una opción para quienes quieran implementarlo en su negocio. Sin presión: el valor del evento está en lo que vas a descubrir.",
  },
];

export function FaqSection() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          PREGUNTAS <span className="text-gradient-wa">FRECUENTES</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-10"
        >
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
          >
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="glass rounded-2xl border-none px-5"
              >
                <AccordionTrigger className="py-5 text-left text-sm font-semibold text-white/90 hover:text-white hover:no-underline [&[data-state=open]>svg]:text-wa">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-white/60">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
