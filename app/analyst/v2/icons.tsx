// Inline SVG icons — terminal aesthetic, square stroke ends, thin lines.
// Using `currentColor` everywhere so consumers control via CSS color.
/* eslint-disable react/jsx-no-comment-textnodes */

export function Plus({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M5 0v10M0 5h10" />
    </svg>
  );
}

export function Cross({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M1 1l8 8M9 1l-8 8" />
    </svg>
  );
}

export function ArrowRight({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square">
      <path d="M1 5h8" />
      <path d="M6 2l3 3-3 3" />
    </svg>
  );
}

export function CopyIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x={3.5} y={3.5} width={6.5} height={6.5} />
      <path d="M2 8.5V2h6.5" />
    </svg>
  );
}

export function CheckIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter">
      <path d="M2 6.5l3 3 5-7" />
    </svg>
  );
}

export function ArrowLeft({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square">
      <path d="M9 5H1" />
      <path d="M4 2L1 5l3 3" />
    </svg>
  );
}

// Apple silhouette — filled with currentColor so it inherits the button's
// text color (acid for solid CTAs, ink for hairline CTAs). Bite + leaf
// kept minimal so the glyph reads at 11–12px.
export function AppleLogo({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
      <path d="M9.43 6.4c0-1.51 1.18-2.2 1.23-2.24-.67-.99-1.72-1.13-2.09-1.14-.89-.09-1.74.52-2.19.52-.46 0-1.15-.51-1.9-.49-.97.01-1.88.57-2.39 1.45-1.02 1.78-.26 4.4.74 5.84.49.71 1.07 1.5 1.83 1.47.74-.03 1.02-.48 1.91-.48.9 0 1.15.48 1.93.46.8-.01 1.3-.72 1.79-1.43.56-.83.79-1.62.81-1.66-.02-.01-1.55-.6-1.57-2.39zM8.04 2.46c.4-.49.67-1.17.6-1.85-.58.02-1.28.39-1.7.88-.37.43-.7 1.12-.61 1.79.65.05 1.31-.33 1.71-.82z" />
    </svg>
  );
}

// Google Play triangle — single-color outline to keep the brutalist
// palette (the official 4-color split would clash with our mono ink).
export function GooglePlayLogo({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
      <path d="M2 1.2v9.6c0 .19.21.31.38.21l8-4.8a.25.25 0 0 0 0-.42l-8-4.8A.25.25 0 0 0 2 1.2z" />
    </svg>
  );
}
