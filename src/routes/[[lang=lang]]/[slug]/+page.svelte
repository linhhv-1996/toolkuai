<script lang="ts">
    import { siteConfig } from "$lib/data/siteConfig";
    import BlogSidebar from "$lib/components/BlogSidebar.svelte";
    import VideoCompressor from "$lib/tools/VideoCompressor.svelte";
    import Heic2Jpeg from "$lib/tools/Heic2Jpeg.svelte";
    import ImageCompressor from "$lib/tools/ImageCompressor.svelte";
    import PdfCompressor from "$lib/tools/PdfCompressor.svelte";

    import RelatedTools from "$lib/components/RelatedTools.svelte";
    import { ui } from "$lib/data/ui.js";
    import { ChevronLeft } from "lucide-svelte";

    let { data } = $props();
    const { tool, lang, metadata } = $derived(data);

    const homePath = $derived(
        lang === siteConfig.defaultLang ? "/" : `/${lang.toLowerCase()}`,
    );

    const t = $derived(ui[lang]?.common || { backToTools: "Back to Tools" });

    const toolComponents: Record<string, any> = {
        "video-compressor": VideoCompressor,
        "heic-to-jpg": Heic2Jpeg,
        "image-compressor": ImageCompressor,
        "pdf-compressor": PdfCompressor,
    };

    const SelectedTool = $derived(toolComponents[tool.id]);

    // Tạo Promise để load Markdown động dựa trên tool và lang
    // Svelte 5 sẽ tự động chạy lại cái này khi tool hoặc lang thay đổi
    let markdownPromise = $derived.by(async () => {
        try {
            // Mày phải dùng đường dẫn tương đối từ file này đến folder content
            const post = await import(
                `../../../content/seo/${lang}/${tool.id}.md`
            );
            return post.default;
        } catch (e) {
            console.warn("Missing SEO content:", e);
            return null;
        }
    });
</script>

<svelte:head>
    <title>{metadata.metaTitle}</title>
    <meta name="description" content={metadata.metaDescription} />
    {#each siteConfig.languages as l}
        {@const s = tool.i18n[l.id]?.slug}
        {#if s}
            <link
                rel="alternate"
                hreflang={l.id}
                href="https://toolkuai.com{l.path ? `/${l.path}` : ''}/{s}"
            />
        {/if}
    {/each}
</svelte:head>

<main class="max-w-[972px] mx-auto px-6 mb-12 mt-10 box-border">
    <nav class="w-full mb-6">
        <a
            href={homePath}
            class="inline-flex items-center space-x-1 text-gray-500 hover:text-[#10b981] transition-colors mono text-[11px] uppercase tracking-wider group"
        >
            <ChevronLeft
                class="w-4 h-4 transition-transform group-hover:-translate-x-1"
            />
            <span>{t.backToTools}</span>
        </a>
    </nav>

    <div class="mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            {metadata.title}
        </h1>
        <p class="text-sm md:text-base text-gray-500 max-w-2xl leading-relaxed">
            {metadata.description}
        </p>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-[600px] flex-shrink-0">
            <div class="mb-12">
                {#if SelectedTool}
                    <SelectedTool {lang} {metadata} />
                {/if}
            </div>

            <article class="blog-content border-t border-gray-100 pt-10">
                {#await markdownPromise}
                    <div
                        class="animate-pulse bg-gray-100 h-40 w-full rounded"
                    ></div>
                {:then MarkdownComponent}
                    {#if MarkdownComponent}
                        <div class="prose prose-sm max-w-none">
                            <MarkdownComponent />
                        </div>
                    {:else}
                        <p class="text-gray-400">Content updating...</p>
                    {/if}
                {/await}
            </article>
        </div>

        <aside class="w-[300px] flex-shrink-0">
            <div class="sticky top-4 space-y-8">
                <RelatedTools {lang} />
                <br />
                <BlogSidebar {lang} />
            </div>
        </aside>
    </div>
</main>
