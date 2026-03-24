import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";

const description = "记录折腾、笔记与随想。";

export default defineConfig({
  title: "图丙 Blog",
  description: description,
  cleanUrls: false,
  lastUpdated: true,
  lang: "zh-CN",
  head: [
    ["link", { rel: "icon", href: "/logo.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:title", content: "图丙 Blog" }],
    ["meta", { property: "og:site_name", content: "图丙 Blog" }],
    ["meta", { property: "og:image", content: "/og.png" }],
    // TODO: 把这里改成你的最终域名/站点地址（用于分享卡片与 SEO）
    ["meta", { property: "og:url", content: "https://tuucc.github.io/" }],
    ["meta", { property: "og:description", content: description }],
    ["meta", { name: "description", content: description }],
    ["meta", { name: "author", content: "图丙" }],
    ["meta", { name: "keywords", content: description }],
  ],
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  sitemap: {
    hostname: "https://tuucc.github.io",
    transformItems: (items) => {
      const permalinkItemBak: typeof items = [];
      const permalinks = (globalThis as any).VITEPRESS_CONFIG.site.themeConfig
        .permalinks;
      items.forEach((item) => {
        const permalink = permalinks?.map[item.url];
        if (permalink)
          permalinkItemBak.push({ url: permalink, lastmod: item.lastmod });
      });
      return [...items, ...permalinkItemBak];
    },
  },

  // 主题设置
  themeConfig: {
    logo: "/logo.png",

    // 顶部导航：Home 回主页，Blog 去 aboutme
    nav: [
      { text: "主页", link: "/" },
      { text: "博客", link: "/aboutme" },
    ],

    // 侧边栏：仅在 /aboutme 下显示
    sidebar: {
    // aboutme 页
    "/aboutme": [
      {
        text: "",
        items: [{ text: "About Me", link: "/aboutme" }],
      },
      {
        text: "Blog",
        collapsed: false,
        items: [
          {
            text: "记一次博客重新推倒重来",
            link: "/blog/记一次博客重新推倒重来",
          },
        ],
      },
    ],
    // 所有 /blog/ 开头的文章页复用同一套侧边栏
    "/blog/": [
      {
        text: "",
        items: [{ text: "About Me", link: "/aboutme" }],
      },
      {
        text: "Blog",
        collapsed: false,
        items: [
          {
            text: "记一次博客重新推倒重来",
            link: "/blog/记一次博客重新推倒重来",
          },
        ],
      },
    ],
  },
   
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    outline: {
      level: [2, 6],
      label: "文章目录",
    },
    lastUpdatedText: "最后更新时间",
    search: {
    provider: 'local',
      },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/tuucc/tuucc.github.io",
      },
    ],
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/tuucc/tuucc.github.io",
    },
    footerInfo: false,
    // 如果你不是 Teek 主题：用默认 footer（两者可以同时写，Teek 会用 footerInfo）
    footer: {
      message: "",
      copyright: "© 2026 图丙",
    },
  },
  vite: {
    plugins: [llmstxt() as any],
  },
});
