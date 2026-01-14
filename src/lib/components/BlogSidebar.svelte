<script lang="ts">
    import { getLatestPosts } from "$lib/blog";
    import { siteConfig, type SupportedLang } from "$lib/data/siteConfig";
    import { ui } from "$lib/data/ui"; // Lấy từ site config ui như mày bảo

    // Lang lấy mặc định từ siteConfig, ko chơi gán cứng 'en'
    let { lang = siteConfig.defaultLang }: { lang: SupportedLang } = $props();

    // Lấy t từ ui theo đúng lang
    const t = $derived(ui[lang]?.blog);
    
    const langPath = $derived(lang === siteConfig.defaultLang ? "" : `/${lang}`);
    
    // Fetch bài viết thật
    const postsPromise = getLatestPosts(lang, 3);
</script>

<div class="w-full md:w-[310px] sticky top-4 self-start">
    <div class="mono text-xs text-gray-500 mb-2 tracking-wider">
        {t.recent}
    </div>

    <div class="divide-y divide-gray-200 border-t border-b border-gray-200 rounded-sm overflow-hidden bg-white">
        {#await postsPromise}
            <div class="py-10 text-center mono text-xs text-gray-400 animate-pulse">
                {t.loading || 'Loading...'}
            </div>
        {:then posts}
            {#each posts as post}
                <a href="{langPath}/blog/{post.slug}" class="blog-item py-4 px-2 flex flex-col group hover:bg-gray-50 transition-colors">
                    <div class="blog-name font-medium text-base mb-2 group-hover:text-[#10b981] transition-colors">
                        {post.title}
                    </div>
                    <div class="text-sm text-gray-600 leading-relaxed mb-1 line-clamp-2 overflow-hidden">
                        {post.description}
                    </div>
                    <div class="mono text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString('en', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </div>
                </a>
            {:else}
                <div class="py-4 px-2 mono text-xs text-gray-400">{t.noPosts || 'No posts found.'}</div>
            {/each}
        {:catch error}
            <div class="py-4 px-2 mono text-xs text-red-400 italic">Error loading posts.</div>
        {/await}
    </div>

    <a href="{langPath}/blog" class="mono text-xs text-gray-500 hover:text-[#10b981] block text-left mt-4 transition ">
        {t.viewAll}
    </a>
</div>

<style>
    /* Chống vỡ layout nếu trình duyệt cổ */
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
