// Turns "Wij leveren ~kwaliteit~ voor *installateurs*" into parts for KapotteLetters.
// ~words~ are switched off, *words* stay lit, everything else is neutral.
export function toParts(text: string) {
  return text
    .split(/(~[^~]+~|\*[^*]+\*)/)
    .filter(Boolean)
    .map((t) => {
      if (t.startsWith('~')) return { text: t.slice(1, -1) };
      if (t.startsWith('*')) return { text: t.slice(1, -1), lit: true };
      return { text: t, plain: true };
    });
}
