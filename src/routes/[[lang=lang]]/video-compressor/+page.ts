import { siteConfig } from '$lib/data/siteConfig';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    // Xác định ngôn ngữ chuẩn từ URL
    const lang = (siteConfig.languages.find(l => l.path === params.lang?.toLowerCase())?.id || siteConfig.defaultLang);
    
    // Tìm tất cả file md trong content
    const modules = import.meta.glob('/src/content/seo/**/*.md');
    
    // Trỏ đúng file guide cho tool này (mày đặt tên file là video-compression-guide.md nhé)
    const path = `/src/content/seo/${lang}/video-compression.md`;
    
    if (modules[path]) {
        const mod = await modules[path]() as any;
        return {
            MarkdownContent: mod.default,
            meta: mod.metadata
        };
    }

    return {
        MarkdownContent: null
    };
};
