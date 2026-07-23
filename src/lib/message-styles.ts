// Shared bubble presentation for every message type. Previously each render
// path (message-bubble, message-renderer, static-message-list) redeclared these
// and passed a class string that child components had to `.includes()`-sniff to
// guess sender + theme — which always failed and mis-colored bubbles. Now each
// content component receives plain `isUser` / `maxWidth` props.

export const BUBBLE_STYLES = {
  sent: "bg-[#007AFF] text-white rounded-[18px]",
  received: "bg-[#E9E9EB] dark:bg-[#2C2C2E] text-black dark:text-white rounded-[18px]",
} as const;

// The corner that pinches in to form the iOS "tail" — only on the last bubble
// of a consecutive run from the same sender. Earlier bubbles in the run stay
// fully rounded. The transition lets a bubble's corner animate closed when a
// later message joins its group.
const TAIL_CORNER = {
  sent: "rounded-br-[6px]",
  received: "rounded-bl-[6px]",
} as const;

export const MAX_WIDTHS = {
  project: "max-w-[280px]",
  music: "max-w-[320px]",
  location: "max-w-[240px]",
  default: "max-w-[85%]",
} as const;

export interface BubbleProps {
  isUser: boolean;
  maxWidth: string;
  isTail?: boolean;
}

export const bubbleClassFor = (isUser: boolean, isTail = true) => {
  const base = isUser ? BUBBLE_STYLES.sent : BUBBLE_STYLES.received;
  const corner = isTail ? (isUser ? TAIL_CORNER.sent : TAIL_CORNER.received) : null;
  return [base, corner, "transition-[border-radius] duration-200 ease-out"].filter(Boolean).join(" ");
};

export const maxWidthFor = (type: string) =>
  MAX_WIDTHS[type as keyof typeof MAX_WIDTHS] ?? MAX_WIDTHS.default;
