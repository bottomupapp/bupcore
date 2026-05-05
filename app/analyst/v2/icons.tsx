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
