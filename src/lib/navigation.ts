/**
 * NAVEGACIÓN GLOBAL — Puente entre los CTAs y el bloque de reservas.
 * ─────────────────────────────────────────────────────────────────
 * En MÓVIL (BlockDeck activo) el salto lo coordina el motor de bloques:
 * cambia al bloque que contiene el calendario y desplaza su contenido.
 * En ESCRITORIO degrada elegantemente a scrollIntoView nativo.
 */

export function goToSchedule(): void {
  const target = document.getElementById("reservar");
  if (!target) return;

  if (document.body.dataset.blockIndex !== undefined) {
    // Modo bloques activo: el deck intercepta y coordina el salto
    window.dispatchEvent(
      new CustomEvent("wa:deck-goto", { detail: { id: "reservar" } })
    );
    return;
  }

  target.scrollIntoView({ behavior: "smooth" });
}
