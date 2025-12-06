const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    ownerAddress: "0x879e4a7d26a0b03D5Aa7b34c0F609cCA93071fD8",
  },
  miniapp: {
    version: "1",
    name: "Flappy Bird",
    subtitle: "Tap to fly and compete globally onchain",
    description: "Classic Flappy Bird gameplay with onchain high scores, global leaderboards, and social sharing. Compete with players worldwide and prove your skills on Base.",
    screenshotUrls: [
      `${ROOT_URL}/screenshots/1.png`,
      `${ROOT_URL}/screenshots/2.png`,
      `${ROOT_URL}/screenshots/3.png`,
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0052FF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "game",
    tags: ["game", "arcade", "onchain", "leaderboard", "competitive"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Tap to fly and compete globally onchain",
    ogTitle: "Flappy Bird - Onchain Arcade Game",
    ogDescription: "Classic Flappy Bird gameplay with onchain high scores and global leaderboards on Base",
    ogImageUrl: `${ROOT_URL}/cover.png`,
  },
} as const;
