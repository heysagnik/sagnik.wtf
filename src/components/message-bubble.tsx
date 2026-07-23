import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import type { MessageType } from "@/lib/types";
import type { ReactionState } from "@/lib/reactions";
import { fadeUp } from "@/lib/motion";
import { Avatar } from "./ui/avatar";
import { MessageRenderer } from "./ui/message-renderer";

interface MessageBubbleProps {
  message: MessageType;
  /** Play the pop-in entrance (first-time visit). Off when messages load instantly. */
  animate?: boolean;
  /** Last bubble of a consecutive run from this sender — gets the avatar and the tail corner. */
  isLastInGroup?: boolean;
  /** Guest-aggregated reaction counts for this message (text messages only, for now). */
  reactions?: ReactionState;
  onToggleReaction?: (messageId: string, emoji: string) => void;
}

// The shared message row: avatar + alignment + (optional) entrance motion, with
// the typed content delegated to MessageRenderer. Avatar and bubble tail only
// appear on the last message of a consecutive run, like iOS Messages.
const MessageBubble = memo<MessageBubbleProps>(({
  message,
  animate = true,
  isLastInGroup = true,
  reactions,
  onToggleReaction,
}) => {
  const isUser = message.sender === "user";

  const handleToggleReaction = useCallback(
    (emoji: string) => onToggleReaction?.(message.id, emoji),
    [onToggleReaction, message.id]
  );

  return (
    <motion.div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
      {...(animate ? fadeUp : { initial: false })}
      role="listitem"
      aria-label={`${isUser ? "Your" : "Received"} message`}
    >
      {!isUser && <Avatar visible={isLastInGroup} />}

      <div className={`flex-1 flex ${isUser ? "justify-end" : "justify-start"}`}>
        <MessageRenderer
          message={message}
          isTail={isLastInGroup}
          reactions={reactions}
          onToggleReaction={onToggleReaction && handleToggleReaction}
        />
      </div>

      {isUser && <div className="w-6 h-6 flex-shrink-0 mb-1" aria-hidden="true" />}
    </motion.div>
  );
});

MessageBubble.displayName = "MessageBubble";
export default MessageBubble;
