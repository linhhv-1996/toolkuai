import type { SupportedLang } from "./siteConfig";

export const ui: Record<SupportedLang, any> = {
    en: {
        nav: { blog: "Blog", searchPlaceholder: "Search tools..." },
        hero: {
            h1: "Lightning Fast Local Processing",
            h2: "Your data stays on your device. Fast, private tools for everyday tasks.",
            howItWorks: "How it Works →"
        },
        search: {
            notFound: "No tools found for",
        },
        blog: {
            recent: 'Recent Blog Posts',
            viewAll: 'View All Posts →',
            noPosts: 'No posts found.',
            loading: 'Loading posts...',
            readArticle: 'Read Article',
        },
        sidebar: {
            related: "More Tools",
            viewAll: "All Tools",
        },
        footer: { builtFor: "Built for Privacy", privacy: "Privacy Policy", term: "Terms", contact: "Contact" }
    },
    'zh-TW': {
        nav: { blog: "部落格", searchPlaceholder: "搜尋工具..." },
        hero: {
            // H1 dùng từ "在地處理" (Local processing) cực kỳ phổ biến ở Đài cho các tool offline/browser-based
            h1: "極速在地處理，隱私安全無虞",
            // Nhấn mạnh vào việc dữ liệu không rời khỏi thiết bị (資料不離身)
            h2: "您的資料絕不外傳，所有處理皆在個人裝置完成。為日常任務打造的極速、私密工具。",
            howItWorks: "運作原理 →"
        },
        search: {
            notFound: "找不到符合的工具：",
        },
        blog: {
            recent: '最新文章',
            viewAll: '查看所有文章 →',
            noPosts: '目前尚無文章。',
            loading: '載入中...',
            readArticle: 'Read Article',
        },
        sidebar: {
            related: "更多工具",
            viewAll: "所有工具",
        },
        footer: {
            builtFor: "專為隱私打造",
            privacy: "隱私權政策",
            term: "服務條款",
            contact: "聯絡我們"
        }
    }
};
