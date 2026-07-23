// Shared vertical rhythm for the message column. messaging-app and
// static-message-list both used to hardcode these and keep them "in sync" by
// hand; now they import the same values.

export const SPACING = {
  top: "h-16 sm:h-20 md:h-24",
  header: "mb-8",
  headerBottom: "h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24",
  messages: "space-y-1 sm:space-y-1.5 md:space-y-2",
  bottom: "h-6 sm:h-8 md:h-10",
} as const;
