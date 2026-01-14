<script lang="ts">
  import { page } from '$app/stores';
  import { tools } from '$lib/data/tools';
  import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
  
  // Tools Components
  import VideoCompressor from '$lib/tools/VideoCompressor.svelte';
  
  // UI Components
  import RelatedTools from '$lib/components/RelatedTools.svelte';
  import AdPlaceholder from '$lib/components/AdPlaceholder.svelte';

  // 1. Get Lang & Slug
  $: lang = (siteConfig.languages.find(
    (l) => l.path.toLowerCase() === $page.params.lang?.toLowerCase()
  )?.id || siteConfig.defaultLang) as SupportedLang;
  
  $: tool = tools.find(t => t.slug === 'video-compressor');
</script>

<svelte:head>
  {#if tool}
    <title>{tool.i18n[lang].metaTitle}</title>
    <meta name="description" content={tool.i18n[lang].metaDescription} />
    <meta name="keywords" content={tool.i18n[lang].keywords.join(', ')} />
  {/if}
</svelte:head>

<main class="max-w-[960px] mx-auto px-6 mb-20">
  
  {#if tool}
    <div class="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
      
      <div class="w-full md:w-[640px]">
        
        <div class="mono text-[11px] tracking-[0.3em] uppercase text-gray-300 mb-6">
           {tool.categoryId} // {tool.i18n[lang].title}
        </div>

        <div class="mb-12">
         
            <VideoCompressor {lang} />

        </div>

        <article class="prose prose-sm max-w-none prose-headings:font-bold prose-headings:font-grotesk prose-a:text-black prose-a:decoration-yellow-400 prose-a:underline-offset-2">
          <h1>{tool.i18n[lang].title}</h1>
          <p class="lead">{tool.i18n[lang].description}</p>
          
          <div class="my-8 h-px bg-gray-100 w-full"></div>

          <h3>Why use this tool?</h3>
          <p>
            This tool processes your files <strong>locally</strong> in your browser. 
            This means your sensitive data never leaves your device. 
            It's faster, more secure, and works even when you are offline.
          </p>
          <ul>
             <li><strong>Privacy First:</strong> Zero server upload.</li>
             <li><strong>Lightning Fast:</strong> No network latency.</li>
             <li><strong>Unlimited:</strong> Process as many files as you want.</li>
          </ul>
        </article>

      </div>

      <aside class="w-full md:w-[310px] flex flex-col gap-8">
        
        <AdPlaceholder height="250px" label="Sponsor" />

        <RelatedTools currentSlug={'video-compressor'} {lang} />

        <div class="sticky top-4">
          <AdPlaceholder height="600px" label="Advertisement" />
        </div>

      </aside>

    </div>

  {:else}
    <div class="py-20 text-center">
      <h1 class="text-4xl font-bold mb-4">404</h1>
      <p class="text-gray-500 mb-8">Tool not found</p>
      <a href="/" class="underline decoration-yellow-400 underline-offset-4 font-bold">Return Home</a>
    </div>
  {/if}

</main>
