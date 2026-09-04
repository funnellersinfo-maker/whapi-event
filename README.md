# whapi-event — Landing del evento en vivo

> **CÓMO HACER QUE WHATSAPP VENDA POR TI 24/7** — Landing premium de captación para un evento en vivo gratuito (WhatsApp API + IA + automatización comercial).

**Producción:** https://whapi-event.pages.dev

---

## Qué es

Landing de conversión (mobile-first, tema oscuro premium con estética WhatsApp + IA) diseñada para tráfico frío de Meta Ads. El visitante:

1. Siente intriga y FOMO (evento en vivo, cupos limitados).
2. Elige una sesión de HOY según su zona horaria (horarios pasados se bloquean solos).
3. Completa un mini-formulario (Nombre · Ciudad · Negocio).
4. Pulsa **“Activar mi experiencia en WhatsApp”** → se abre `wa.me` con un mensaje personalizado en tiempo real (solo guiones, sin símbolos). WhatsApp se convierte en la primera demo: la IA saluda al registrante.

## Stack

- **Next.js 16** (App Router) + **TypeScript** — exportación estática (`output: 'export'`)
- **Tailwind CSS 4** + shadcn/ui + **Framer Motion**
- **Sin backend**: 100% client-side (compatible con hosting estático)

## Estructura clave

```
src/
  app/                    # layout (SEO + viewport), page (composición), globals.css (tema)
  components/landing/     # Hero, PhoneDemo (chat animado), ScheduleSection (cupos + form),
                          # FomoFinalSections, FaqSection, Footer, StickyCta, FloatingWhatsApp…
  config/site.ts          # CONFIG CENTRAL: número wa.me, horarios, escasez, Pixel de Meta
  lib/
    schedule.ts           # Zona horaria del visitante, bloqueo de horarios pasados, countdown
    whatsapp.ts           # Armado de mensajes personalizados (solo guiones)
    tracking.ts           # Meta Pixel (opcional) + dataLayer para remarketing
```

## Comandos

```bash
bun install        # dependencias
bun run dev        # desarrollo (http://localhost:3000)
bun run lint       # ESLint
bun run build      # build estático → carpeta out/
```

## Deploy (Cloudflare Pages)

```bash
bun run build
npx wrangler pages deploy ./out --project-name=whapi-event
```

## Personalización

Todo lo editable vive en `src/config/site.ts`: número de WhatsApp, horarios del día, cupos máximos por sesión, textos de escasez y el ID del Pixel de Meta (vacío = desactivado).

---

© Funnelers — funnellers.info@gmail.com
