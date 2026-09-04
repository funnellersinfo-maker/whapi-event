"use client";

/**
 * WHATSAPP FLOTANTE (desktop) — fijo en la esquina inferior derecha,
 * no tapa contenido. En móvil se oculta: la acción primaria ya vive
 * en el CTA sticky inferior. Mensaje pre-armado vía wa.me.
 * Dispara Lead (cliente potencial) al hacer clic.
 */

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { buildDirectLink } from "@/lib/whatsapp";
import { trackLead } from "@/lib/tracking";

export function FloatingWhatsApp() {
  return (
    <motion.a
      href={buildDirectLink("boton_flotante")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLead("whatsapp_flotante")}
      aria-label={`Abrir WhatsApp y hablar con ${SITE_CONFIG.whatsapp.display}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.4, type: "spring", stiffness: 260, damping: 18 }}
      className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-wa animate-glow-breath transition-transform hover:scale-110 active:scale-95 lg:flex"
    >
      <MessageCircle className="h-6 w-6 text-[#04120a]" aria-hidden="true" />
    </motion.a>
  );
}
