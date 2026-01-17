<script lang="ts">
    import RelatedTools from "$lib/components/RelatedTools.svelte";
    import BlogSidebar from "$lib/components/BlogSidebar.svelte";

    let { data } = $props();
    const { slug, lang } = $derived(data);

    let markdownPromise = $derived.by(async () => {
        try {
            const post = await import(`../../../../content/pages/${lang}/${slug}.md`);
            return post.default;
        } catch (e) {
            console.warn("Missing page content:", e);
            return null;
        }
    });
</script>

<svelte:head>
    <title>{slug.toUpperCase()} - Toolkuai</title>
</svelte:head>

<main class="max-w-[972px] mx-auto px-6 mb-12 mt-10 box-border">
    <div class="flex flex-col md:flex-row gap-6">
        
        <div class="w-full md:w-[600px] flex-shrink-0">
            <article class="static-content">
                {#await markdownPromise}
                    <div class="animate-pulse space-y-4">
                        <div class="h-8 bg-gray-100 w-3/4 rounded"></div>
                        <div class="h-4 bg-gray-100 w-full rounded"></div>
                        <div class="h-4 bg-gray-100 w-full rounded"></div>
                    </div>
                {:then MarkdownComponent}
                    {#if MarkdownComponent}
                        <div class="prose prose-slate prose-sm max-w-none blog-content">
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
                <BlogSidebar {lang} />
            </div>
        </aside>
    </div>
</main>
