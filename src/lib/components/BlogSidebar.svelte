<script lang="ts">
    import { getLatestPosts } from '$lib/blog';
    import { ui } from '$lib/data/ui';
    import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';

    let { lang }: { lang: SupportedLang } = $props();

    const t = $derived(ui[lang].blog);
    const langPath = $derived(
        siteConfig.languages.find(l => l.id === lang)?.path 
        ? `/${siteConfig.languages.find(l => l.id === lang)?.path}` 
        : ''
    );
    let postsPromise = $derived(getLatestPosts(lang, 3));
</script>

<aside class="w-full md:w-5/12 sticky top-4 self-start">
    <div class="mono text-xs text-gray-500 mb-2 uppercase tracking-wider">
        {t.recent}
    </div>
    
    <div class="divide-y divide-gray-200 border-t border-b border-gray-200 rounded-sm overflow-hidden">
        {#await postsPromise}
            <div class="py-10 text-center mono text-xs text-gray-400 animate-pulse">
                {t.loading}
            </div>
        {:then posts}
            {#each posts as post}
                <a href="{langPath}/blog/{post.slug}" class="blog-item py-4 px-2 flex flex-col group block hover:bg-gray-50 transition-colors">
                    <div class="blog-name font-medium text-md mb-2 group-hover:text-[#10b981] transition-colors">
                        {post.title}
                    </div>
                    <div class="text-sm text-gray-600 leading-relaxed mb-1 line-clamp-2">
                        {post.description}
                    </div>
                    <div class="mono text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW')}
                    </div>
                </a>
            {:else}
                <div class="py-4 px-2 mono text-xs text-gray-400">
                    {t.noPosts}
                </div>
            {/each}
        {:catch error}
            <div class="py-4 px-2 mono text-xs text-red-400">Error loading posts.</div>
        {/await}
    </div>

    <a href="/blog" class="mono text-xs text-gray-500 hover:text-[#10b981] block text-left mt-4 transition">
        {t.viewAll}
    </a>
</aside>
