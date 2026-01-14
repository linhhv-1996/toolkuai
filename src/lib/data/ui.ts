import type { SupportedLang } from './siteConfig';

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
            loading: 'Loading posts...'
        },
        footer: { builtFor: "Built for Privacy", privacy: "Privacy Policy", github: "Github", contact: "Contact" }
    },
    'zh-TW': {
        nav: { blog: "部落格", searchPlaceholder: "搜尋工具..." },
        hero: {
            h1: "Lightning Fast Local Processing",
            h2: "Your data stays on your device. Fast, private tools for everyday tasks.",
            howItWorks: "運作原理 →"
        },
        search: {
            notFound: "No tools found for",
        },
        blog: {
            recent: '最新文章',
            viewAll: '查看全部文章 →',
            noPosts: '尚無文章。',
            loading: '載入中...'
        },
        footer: { builtFor: "專為隱私打造", privacy: "隱私政策", github: "Github", contact: "聯絡我們" }
    }
};
