import { siteConfig } from '$lib/data/siteConfig';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
    return siteConfig.languages.some(l => l.path === param.toLowerCase() && l.path !== '');
};
