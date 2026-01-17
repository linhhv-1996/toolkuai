import { getLangFromPath, siteConfig } from '$lib/data/siteConfig';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const lang = getLangFromPath(params.lang);
    const slug = params.slug;
    
    // Chỉ cho phép 3 slug này
    const allowedPages = ['how-it-works', 'privacy', 'terms'];
    if (!allowedPages.includes(slug)) throw error(404, 'Page not found');

    return {
        slug,
        lang
    };
};
