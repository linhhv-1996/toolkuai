<script lang="ts">
    import { getLatestPosts } from "$lib/blog";
    import { siteConfig, type SupportedLang } from "$lib/data/siteConfig";
    import { ui } from "$lib/data/ui";

    let { lang = siteConfig.defaultLang }: { lang: SupportedLang } = $props();
    const t = $derived(ui[lang]?.blog);
    const langPath = $derived(lang === siteConfig.defaultLang ? "" : `/${lang}`);
    const postsPromise = $derived(getLatestPosts(lang, 3));
</script>

<div class="w-full flex-1 flex-shrink-0">
    <div class="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 ml-0">
        {t.recent}
    </div>

    <div class="divide-y divide-gray-100 border-t border-b border-gray-100 bg-white">
        {#await postsPromise}
            <div class="py-6 text-center text-[11px] text-gray-400 animate-pulse uppercase">
                {t.loading || 'Loading...'}
            </div>
        {:then posts}
            {#each posts as post}
                <a href="{langPath}/blog/{post.slug}" class="py-4 px-0 block group hover:bg-gray-50 transition-colors">
                    <div class="text-sm font-semibold text-slate-900 leading-snug mb-1.5 group-hover:text-[#10b981] transition-colors">
                        {post.title}
                    </div>
                    <div class="text-[13px] text-slate-600 leading-normal line-clamp-2 mb-2">
                        {post.description}
                    </div>
                    <div class="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                        {new Date(post.date).toLocaleDateString('en', { 
                            year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                    </div>
                </a>
            {:else}
                <div class="py-4 px-2 text-[11px] text-gray-400 italic">{t.noPosts || 'No posts found.'}</div>
            {/each}
        {:catch error}
            <div class="py-4 px-2 text-[11px] text-red-400 italic">Error loading posts.</div>
        {/await}
    </div>

    <a href="{langPath}/blog" class="text-[11px] font-bold text-gray-400 hover:text-[#10b981] block mt-4 transition-colors uppercase tracking-widest">
        {t.viewAll}
    </a>
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
