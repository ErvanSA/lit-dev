/** Helper bersama untuk unit test komponen (happy-dom). */

/** Buat + pasang elemen, tunggu render selesai. */
export async function mount<K extends keyof HTMLElementTagNameMap>(
  tag: K,
): Promise<HTMLElementTagNameMap[K]> {
  const el = document.createElement(tag);
  document.body.appendChild(el);
  await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
  return el;
}
