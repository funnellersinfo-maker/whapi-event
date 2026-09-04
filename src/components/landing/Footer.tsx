"use client";

/**
 * FOOTER — mínimo, informativo, pegado al fondo (mt-auto en el layout raíz).
 * Email protegido contra overflow en móvil (break-all en span interno).
 */

import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { buildDirectLink } from "@/lib/whatsapp";
import { trackLead } from "@/lib/tracking";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/6 bg-ink-2/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-white">
              {SITE_CONFIG.brand}
            </p>
            <p className="mt-1 text-xs text-white/45">
              {SITE_CONFIG.brandTagline}
            </p>
          </div>

          <nav aria-label="Contacto" className="flex flex-col items-center gap-2 md:items-end">
            <a
              href={buildDirectLink("footer")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLead("whatsapp_footer")}
              className="inline-flex items-center gap-2 rounded-xl border border-wa/25 bg-wa/10 px-4 py-2.5 text-sm font-semibold text-wa transition-colors hover:bg-wa/20"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {SITE_CONFIG.whatsapp.display}
            </a>
            <a
              href="mailto:funnellers.info@gmail.com"
              className="max-w-full text-xs text-white/50 transition-colors hover:text-white/80"
            >
              <span className="break-all">funnellers.info@gmail.com</span>
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-white/5 pt-6 text-[11px] text-white/35 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.brand}. Todos los derechos
            reservados.
          </p>
          <p>Evento en vivo · Gratuito · Cupos limitados</p>
        </div>
      </div>
    </footer>
  );
}
