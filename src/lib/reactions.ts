// Single source of truth for allowed reaction emoji — used by the picker UI
// and by the API route's server-side validation, so they can't drift apart.
export const REACTIONS = ["❤️", "👍", "🔥", "😂", "😯", "😢", "💀"] as const;

export type ReactionEmoji = (typeof REACTIONS)[number];

export const isReactionEmoji = (value: string): value is ReactionEmoji =>
  (REACTIONS as readonly string[]).includes(value);

export interface ReactionState {
  counts: Record<string, number>;
  mine: string | null;
}
