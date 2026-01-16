import { getLangFromPath } from '$lib/data/siteConfig';
import { getToolBySlug } from '$lib/data/tools';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const lang = getLangFromPath(params.lang);
    const tool = getToolBySlug(params.slug, lang);

    if (!tool) throw error(404, 'Tool not found');

    return {
        tool,
        lang,
        metadata: tool.i18n[lang],
    };
};
