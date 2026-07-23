// Single source of truth for personal/brand info, used by the header,
// compact header, splash screen, and (eventually) the JSON-LD schema.

export const PROFILE = {
  name: "Sagnik Sahoo",
  username: "@heysagnik",
  shortTitle: "Developer",
  bio: "Product developer. Always curious.",
  avatar: "/char.png",
  socialUrl: "https://x.com/heysagnik",
  details: ["Estd. 2005", "Haldia, India", "he/him"],
} as const;

export const BRAND = {
  name: "sagnik",
  domain: ".wtf",
  title: "Product developer",
  avatar: "/char.png",
} as const;
