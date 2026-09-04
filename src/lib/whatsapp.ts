"use client";

/**
 * WHATSAPP — Constructor de mensajes personalizados en tiempo real
 * ────────────────────────────────────────────────────────────────
 * REGLA DE NEGOCIO: mensajes BIEN ORGANIZADOS, SIN SÍMBOLOS decorativos.
 * Únicamente guiones (-) para estructurar la información de cada usuario.
 * Cada mensaje se construye al momento con los datos reales del registro
 * y se abre vía wa.me/<número>?text=<mensaje codificado>.
 */

import { SITE_CONFIG, formatSlot12h } from "@/config/site";

export interface RegistrationData {
  slot: string;
  name: string;
  city: string;
  business: string;
  /** "hoy" (default) o "manana" cuando reserva la primera sesión de mañana */
  day?: "hoy" | "manana";
}

/** Limpia el valor: sin símbolos raros, solo letras/números/espacios básicos */
function clean(value: string): string {
  return value
    .replace(/[^\p{L}\p{N}\s.,'&()]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Mensaje que llega al WhatsApp del negocio cuando el usuario
 * activa su experiencia. Estructura limpia, solo guiones.
 */
export function buildRegistrationMessage(data: RegistrationData): string {
  const slotLabel = formatSlot12h(data.slot);
  const day = data.day === "manana" ? "manana" : "hoy";
  const sessionLine =
    data.day === "manana"
      ? `- Sesion de manana - ${slotLabel}`
      : `- Sesion de hoy - ${slotLabel}`;

  const lines = [
    "NUEVO REGISTRO EVENTO EN VIVO",
    "",
    `- Nombre - ${clean(data.name)}`,
    `- Ciudad - ${clean(data.city)}`,
    `- Negocio - ${clean(data.business)}`,
    sessionLine,
    `- Cupo - Evento gratuito en vivo`,
    `- Origen - Landing WhatsApp IA`,
    "",
    `Hola, soy ${clean(data.name)}. Acabo de reservar mi lugar para la sesion de ${day} ${slotLabel} y quiero activar mi experiencia en WhatsApp para descubrir como hacer que mi negocio venda 24-7 con IA.`,
  ];
  return lines.join("\n");
}

/** Enlace wa.me con el mensaje personalizado codificado */
export function buildWhatsAppLink(data: RegistrationData): string {
  const message = buildRegistrationMessage(data);
  return `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** Enlace genérico de CTA directo (sin registro previo) */
export function buildDirectLink(source: string): string {
  const message = [
    "Hola, vengo de la landing del evento en vivo.",
    "",
    `- Origen - ${clean(source)}`,
    "",
    "Quiero ver como funciona la IA que vende por WhatsApp 24-7.",
  ].join("\n");
  return `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
