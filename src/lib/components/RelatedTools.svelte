<script lang="ts">
    import { tools } from "$lib/data/tools";
    import { siteConfig, type SupportedLang } from "$lib/data/siteConfig";
    import { ui } from "$lib/data/ui";

    let { lang = siteConfig.defaultLang, currentToolId = "", num = 3 }: { lang: SupportedLang, currentToolId?: string, num?: number } = $props();
    
    // Lấy label từ UI config (giả định mày có key relatedTools trong ui[lang].common hoặc tương tự)
    const t = $derived(ui[lang]?.sidebar || { related: "More Tools", viewAll: "All Tools" });
    const langPath = $derived(lang === siteConfig.defaultLang ? "" : `/${lang.toLowerCase()}`);

    // Logic xáo trộn và lấy 3 tool
    const relatedTools = $derived.by(() => {
        // 1. Lọc bỏ tool hiện tại
        const filtered = tools.filter(t => t.id !== currentToolId);
        // 2. Xáo trộn ngẫu nhiên (Fisher-Yates shuffle rút gọn)
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        // 3. Lấy 3 thằng đầu
        return shuffled.slice(0, num);
    });
</script>

<div class="w-full flex-1 flex-shrink-0">
    <div class="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 ml-0">
        {t.related}
    </div>

    <div class="divide-y divide-gray-100 border-t border-b border-gray-100 bg-white">
        {#each relatedTools as tool}
            {@const metadata = tool.i18n[lang]}
            <a href="{langPath}/{metadata.slug}" class="py-4 px-0 block group hover:bg-gray-50 transition-colors">
                <div class="blog-content text-[15px] font-semibold text-slate-900 leading-snug mb-1.5 group-hover:text-[#10b981] transition-colors flex items-center gap-2">
                    <span>{metadata.title}</span>
                </div>
                <div class="blog-content text-[13px] text-slate-600 leading-normal line-clamp-2">
                    {metadata.description}
                </div>
            </a>
        {/each}
    </div>
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
