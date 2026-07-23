import { memo } from "react";
import type { MessageType } from "@/lib/types";
import type { BubbleProps } from "@/lib/message-styles";
import { maxWidthFor } from "@/lib/message-styles";
import type { ReactionState } from "@/lib/reactions";
import { BlogMessage } from "../messages/blog-message";
import { ProjectMessage } from "../messages/project-message";
import { MusicMessage } from "../music-widget";
import { LocationMessage } from "../map-widget";
import { PhotosMessage } from "../messages/photos-message";
import { ResumeMessage } from "../messages/resume-message";
import { TextMessage } from "../messages/text-message";

interface MessageRendererProps {
  message: MessageType;
  /** Last bubble of a consecutive run from this sender — gets the iOS tail corner. */
  isTail?: boolean;
  /** Guest-aggregated reaction counts (text messages only, for now). */
  reactions?: ReactionState;
  onToggleReaction?: (emoji: string) => void;
}

// The single message-type switch. Renders typed content only — no avatar, no
// layout row, no motion. MessageBubble wraps this with the row + entrance.
export const MessageRenderer = memo(({ message, isTail = true, reactions, onToggleReaction }: MessageRendererProps) => {
  const isUser = message.sender === "user";
  const maxWidth = maxWidthFor(message.type);
  const common: BubbleProps = { isUser, maxWidth, isTail };

  switch (message.type) {
    case "text":
      return (
        <TextMessage
          content={message.content || ""}
          {...common}
          reactions={reactions}
          onToggleReaction={onToggleReaction}
        />
      );
    case "location":
      return message.location && <LocationMessage locationCity={message.location.city} />;
    case "music":
      return <MusicMessage content={message.content} {...common} />;
    case "photos":
      return (
        message.photos && (
          <PhotosMessage content={message.content} photos={message.photos} {...common} />
        )
      );
    case "resume":
      return (
        message.resumeLink && (
          <ResumeMessage
            content={message.content}
            resumeLink={message.resumeLink}
            resumeLinkText={message.resumeLinkText}
            {...common}
          />
        )
      );
    case "blog":
      return <BlogMessage content={message.content} blogs={message.blogs} {...common} />;
    case "project":
      return (
        message.project && (
          <ProjectMessage content={message.content} project={message.project} {...common} />
        )
      );
    default:
      return (
        <TextMessage
          content={(message as MessageType).content || ""}
          {...common}
          reactions={reactions}
          onToggleReaction={onToggleReaction}
        />
      );
  }
});

MessageRenderer.displayName = "MessageRenderer";
