import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";
import { blogSidebarItems } from "./sidebar.blog.generated.mts";

const description = "记录折腾、笔记与随想。";
const siteUrl = "https://body.de5.net";

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
    ["meta", { property: "og:url", content: `${siteUrl}/` }],
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
    hostname: siteUrl,
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

    // 侧边栏：全站共用（因此从 /aboutme 进入也能直接看到年份分组）
    sidebar: [
      { text: "About Me", link: "/aboutme" },
      {
        text: "Blog",
        items: blogSidebarItems,
      },
    ],
   
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
    footer: {
      message: "",
      copyright: "© 2026 图丙",
    },
  },
  vite: {
    plugins: [llmstxt() as any],
  },
});
