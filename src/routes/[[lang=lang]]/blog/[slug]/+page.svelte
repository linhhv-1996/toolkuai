<script lang="ts">
  import { siteConfig } from "$lib/data/siteConfig";
  import { ui } from "$lib/data/ui";
  import RelatedTools from "$lib/components/RelatedTools.svelte";

  let { data } = $props();
  const { post, lang } = $derived(data);

  const t = $derived(ui[lang]);
  
  const langPath = $derived(
    siteConfig.languages.find((l) => l.id === lang)?.path
      ? `/${siteConfig.languages.find((l) => l.id === lang)?.path}`
      : ""
  );
</script>

<article class="max-w-[972px] mx-auto px-6 mb-20 mt-10">
  <nav class="mb-8 text-[13px] text-slate-500 flex items-center gap-2">
    <a href="{langPath}/" class="hover:text-[#10b981] transition-colors">Home</a>
    <span>/</span>
    <a href="{langPath}/blog" class="hover:text-[#10b981] transition-colors">{t.nav.blog}</a>
  </nav>

  <div class="flex flex-col md:flex-row gap-6">
    <div class="w-full md:w-[600px]">
      <header class="mb-10">
        <div class="text-[11px] font-bold text-[#10b981] uppercase tracking-[0.2em] mb-3">
          {new Date(post.meta.date).toLocaleDateString(lang, { 
            year: 'numeric', month: 'long', day: 'numeric' 
          })}
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {post.meta.title}
        </h1>
        <h2 class="mt-2 text-md font-medium tracking-tight text-slate-400 leading-tight">
          {post.meta.description}
        </h2>
      </header>

      <div class="prose prose-slate prose-sm max-w-none border-t border-gray-100 pt-0 blog-content">
        {@html post.content}
      </div>
    </div>

    <aside class="w-full md:w-[300px] flex-shrink-0">
      <div class="sticky top-6">
        <RelatedTools {lang} num={5}/>
      </div>
    </aside>
  </div>
</article>
