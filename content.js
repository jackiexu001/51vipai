const siteConfig = {
  brand: {
    name: "51VIPAI",
    subtitle: "美股 × AI 个人研究库",
    logoImage: "",
  },
  socialLinks: [
    { label: "X / Twitter", shortLabel: "X", icon: "x", url: "#" },
    { label: "YouTube", shortLabel: "YT", icon: "youtube", url: "#" },
  ],
  quickLinks: [
    { label: "美股新手路线", url: "articles/us-stocks-beginner.html" },
    { label: "AI 工具地图", url: "articles/ai-tools-map.html" },
    { label: "市场观察模板", url: "#" },
    { label: "AI 产业链入门", url: "#" },
  ],
};

const categories = {
  "us-stocks": {
    title: "美股",
    articles: [
      {
        title: "美股新手第一课：先看懂指数、公司和 ETF",
        summary: "用最小知识地图理解美股市场，不急着买入，先建立观察框架。",
        tag: "新手入门",
        date: "2026.08.18",
        image: "",
        url: "articles/us-stocks-beginner.html",
        large: true,
      },
      {
        title: "每日市场观察模板",
        summary: "记录指数、利率、美元、行业轮动和重点公司新闻。",
        tag: "市场观察",
        date: "待添加",
        image: "",
        url: "#",
      },
      {
        title: "财报笔记怎么写",
        summary: "收入、利润、现金流、指引和估值，是拆财报的五个入口。",
        tag: "公司研究",
        date: "待添加",
        image: "",
        url: "#",
      },
      {
        title: "美股观察清单",
        summary: "用一张清单跟踪指数、行业、龙头公司、财报日和宏观事件。",
        tag: "研究框架",
        date: "待添加",
        image: "",
        url: "#",
      },
    ],
  },
  ai: {
    title: "AI",
    articles: [
      {
        title: "AI 工具地图：从使用者到创造者",
        summary: "整理常用 AI 工具、Agent、模型和工作流，形成自己的工具箱。",
        tag: "AI 工具",
        date: "2026.08.18",
        image: "",
        url: "articles/ai-tools-map.html",
        large: true,
      },
      {
        title: "AI 产业链入门",
        summary: "从芯片、云、模型、应用四层理解 AI 产业。",
        tag: "产业链",
        date: "待添加",
        image: "",
        url: "#",
      },
      {
        title: "我的 AI 学习路线",
        summary: "把概念、实践、项目和投资观察串成一条路线。",
        tag: "路线图",
        date: "待添加",
        image: "",
        url: "#",
      },
      {
        title: "AI 公司观察池",
        summary: "记录 OpenAI、NVIDIA、Microsoft、Google、Meta 等核心公司的变化。",
        tag: "公司索引",
        date: "待添加",
        image: "",
        url: "#",
      },
    ],
  },
};
