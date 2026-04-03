import type { LandingSchema } from "./zh.js";

export const landingEn: LandingSchema = {
  ui: {
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      techStack: "Tech Stack",
      github: "GitHub",
      getStarted: "Get Started",
      dashboard: "Dashboard",
    },
    hero: {
      title: "Full-Stack AI App Scaffold",
      subtitle:
        "Modern full-stack template powered by React + Hono + tRPC + Prisma, built for the AI era",
      cta: "Get Started",
      secondary: "Sign In",
      ctaGithub: "Fork Template",
      ctaLearn: "Learn Architecture",
    },
    features: {
      heading: "Why This Template",
      subheading:
        "Production-ready full-stack architecture covering every layer from database to frontend",
      trpc: {
        title: "End-to-End Type Safety",
        desc: "tRPC + Zod delivers full type inference from backend to frontend — no manual API type definitions",
      },
      ssr: {
        title: "React Router v7 SSR",
        desc: "Server-side rendering for faster first paint and better SEO performance",
      },
      db: {
        title: "Prisma ORM",
        desc: "Type-safe database operations with built-in migration management and intuitive data modeling",
      },
      backend: {
        title: "Hono Backend",
        desc: "Lightweight, high-performance web framework compatible with multiple runtimes (Node.js / Bun / Edge)",
      },
      tailwind: {
        title: "TailwindCSS 4",
        desc: "Utility-first CSS framework with CSS variable theming and dark mode support",
      },
      workspace: {
        title: "Multi-Workspace Support",
        desc: "Built-in workspace model for team collaboration and multi-tenant scenarios",
      },
    },
    footer: {
      copyright: "© 2024 AI Stack. All rights reserved.",
    },
  },
};
