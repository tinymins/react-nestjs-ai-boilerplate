export const landingZh = {
  ui: {
    nav: {
      features: "核心优势",
      howItWorks: "工作原理",
      techStack: "技术栈",
      github: "GitHub",
      getStarted: "开始使用",
      dashboard: "进入控制台",
    },
    hero: {
      title: "全栈 AI 应用脚手架",
      subtitle:
        "基于 React + Hono + tRPC + Prisma 的现代全栈模板，为 AI 时代而生",
      cta: "立即开始",
      secondary: "登录账号",
      ctaGithub: "Fork 模板",
      ctaLearn: "了解架构",
    },
    features: {
      heading: "为什么选择这个模板",
      subheading: "开箱即用的全栈架构，覆盖从数据库到前端的每一层",
      trpc: {
        title: "端到端类型安全",
        desc: "tRPC + Zod 提供从后端到前端的完整类型推导，告别手写 API 类型定义",
      },
      ssr: {
        title: "React Router v7 SSR",
        desc: "服务端渲染带来更快的首屏加载和更好的 SEO 表现",
      },
      db: {
        title: "Prisma ORM",
        desc: "类型安全的数据库操作，内置迁移管理和直观的数据建模",
      },
      backend: {
        title: "Hono 后端框架",
        desc: "轻量高性能的 Web 框架，兼容多运行时（Node.js / Bun / Edge）",
      },
      tailwind: {
        title: "TailwindCSS 4",
        desc: "原子化 CSS 框架配合 CSS 变量主题系统，支持深色模式",
      },
      workspace: {
        title: "多工作区支持",
        desc: "内置工作区模型，支持团队协作和多租户场景",
      },
    },
    footer: {
      copyright: "© 2024 AI Stack. All rights reserved.",
    },
  },
};

export type LandingSchema = typeof landingZh;
