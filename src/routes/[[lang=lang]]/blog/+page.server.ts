import { getLatestPosts } from '$lib/blog';
import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    // Xác định ngôn ngữ từ params
    const lang = (siteConfig.languages.find(
        (l) => l.path === params.lang?.toLowerCase()
    )?.id || siteConfig.defaultLang) as SupportedLang;

    // Lấy tất cả bài viết (set limit cao để lấy hết)
    const posts = await getLatestPosts(lang, 100);

    return {
        posts,
        lang
    };
};
