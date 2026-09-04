/**
 * CONFIGURACIÓN CENTRAL DEL EVENTO
 * ─────────────────────────────────
 * Editar SOLO este archivo para cambiar: teléfono, horarios, cupos,
 * píxel de Meta, textos del CTA, enlaces de grupo, etc.
 * Sin tocar el resto del código.
 */

export const SITE_CONFIG = {
  /** Marca visible en la página */
  brand: "FUNNELLERS",
  brandTagline: "WhatsApp API + Inteligencia Artificial",

  /** Datos de contacto / destino de registros */
  whatsapp: {
    /** Número en formato internacional SIN "+" ni espacios (wa.me) */
    number: "573228973800",
    /** Número legible para mostrar en UI */
    display: "+57 322 897 3800",
    /** Enlace opcional al grupo/canal de WhatsApp del evento (déjalo vacío para usar wa.me directo) */
    groupLink: "",
  },

  /** Evento en vivo */
  event: {
    name: "Cómo hacer que WhatsApp venda por ti 24/7",
    badge: "EVENTO EN VIVO · GRATIS",
    /** Horarios de HOY en formato 24h "HH:MM" (zona horaria del visitante) */
    slots: ["08:30", "10:00", "11:30", "14:00", "15:30", "17:00", "19:30"],
    /** Máximo de negocios por sesión (escasez real) */
    maxSeatsPerSlot: 2,
    /** Minutos antes del inicio en que ya no se puede reservar */
    lockMinutesBefore: 0,
  },

  /**
   * TRACKING — Meta Pixel
   * Pixel oficial cargado en el layout (init + PageView).
   * LOS BOTONES DE LA LANDING DISPARAN "Lead" (clientes potenciales),
   * sin ViewContent ni ningún otro evento.
   * Eventos enviados: PageView (carga) + Lead (cada CTA)
   */
  tracking: {
    pixelId: "1539107407505521", // ← Pixel activo
    apiToken: "", // ← opcional: token CAPI para eventos de servidor (futuro)
    testEventCode: "", // ← opcional: código de prueba de Meta
  },

  /** SEO / Open Graph */
  seo: {
    title: "Evento Gratis: Cómo Hacer que WhatsApp Venda por Ti 24/7",
    description:
      "Descubre en vivo cómo empresas convierten WhatsApp en un sistema que responde, califica y vende con IA, incluso mientras duermes. Cupos limitados.",
    siteUrl: "https://whapi-event.pages.dev",
    ogImage: "/img/og-background.png",
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;

/** Convierte "14:00" → "02:00 PM" */
export function formatSlot12h(slot: string): string {
  const [hStr, mStr] = slot.split(":");
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${mStr} ${suffix}`;
}
