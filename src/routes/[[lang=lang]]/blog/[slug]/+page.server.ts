import { error } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/blog';
import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { lang: langParam, slug } = params;
    
    const lang = (siteConfig.languages.find(
        (l) => l.path === langParam?.toLowerCase()
    )?.id || siteConfig.defaultLang) as SupportedLang;

    const post = await getPostBySlug(lang, slug || '');

    if (!post) {
        throw error(404, 'Post not found');
    }

    return {
        post,
        lang
    };
};
