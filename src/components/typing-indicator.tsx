import { memo } from 'react';
import { Avatar } from './ui/avatar';

const STYLES = {
  container: "flex items-end gap-2",
  bubble: "bg-[#262628] px-3 py-2 rounded-full inline-flex items-center",
  dotsContainer: "flex space-x-1",
  dot: "typing-dot",
} as const;

// Animation lives in globals.css (`.typing-dot` + `@keyframes typingBounce`).
// Only rendered while a real async response is pending, so it always animates.
// Carries the avatar while it's up — the last real message hands it off here
// for the duration of the "typing" beat, like iOS Messages.
const TypingIndicator = memo(() => {
  return (
    <div className={STYLES.container}>
      <Avatar />
      <div
        className={STYLES.bubble}
        role="status"
        aria-label="Someone is typing"
      >
        <div className={STYLES.dotsContainer}>
          <div className={STYLES.dot} />
          <div className={STYLES.dot} />
          <div className={STYLES.dot} />
        </div>
      </div>
    </div>
  )
})

TypingIndicator.displayName = 'TypingIndicator'
export default TypingIndicator
