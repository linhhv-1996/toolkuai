<script lang="ts">
  import { siteConfig } from "$lib/data/siteConfig";
  import { ui } from "$lib/data/ui";
  import RelatedTools from "$lib/components/RelatedTools.svelte";

  let { data } = $props();
  // Destructure reactively trong Svelte 5
  const { posts, lang } = $derived(data);

  // Lấy translation từ ui config
  const t = $derived(ui[lang]);
  
  // Tạo path prefix cho link
  const langPath = $derived(
    siteConfig.languages.find((l) => l.id === lang)?.path
      ? `/${siteConfig.languages.find((l) => l.id === lang)?.path}`
      : ""
  );
</script>

<header class="max-w-[972px] mx-auto px-6 mb-10 mt-8 text-center md:text-left">
  <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
    {t.nav.blog}
  </h1>
  <p class="text-[15px] text-slate-600 max-w-2xl leading-relaxed">
    {t.hero.h2} 
  </p>
</header>

<main class="max-w-[972px] mx-auto px-6 mb-20 flex flex-col md:flex-row gap-6">
  <div class="w-full md:w-[600px] space-y-10">
    <section>
      <div class="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-[0.2em] ml-1">
        {t.blog.recent}
      </div>

      <div class="divide-y divide-gray-100 border-t border-b border-gray-100">
        {#if posts.length === 0}
          <div class="py-20 text-center text-gray-400 italic bg-gray-50 rounded border border-dashed">
            {t.blog.noPosts}
          </div>
        {:else}
          {#each posts as post}
            <article class="group">
              <a href="{langPath}/blog/{post.slug}" class="py-8 px-2 block group hover:bg-gray-50 transition-all">
                <div class="text-[11px] font-bold text-[#10b981] uppercase tracking-widest mb-2">
                  {new Date(post.date).toLocaleDateString(lang, { 
                      year: 'numeric', month: 'short', day: 'numeric' 
                  })}
                </div>
                
                <h2 class="text-xl font-bold text-slate-900 group-hover:text-[#10b981] transition-colors mb-2 leading-snug">
                  {post.title}
                </h2>
                
                <p class="text-[14px] text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {post.description}
                </p>

                <div class="text-[13px] font-bold text-slate-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t.blog.readArticle} <span class="text-[#10b981]">→</span>
                </div>
              </a>
            </article>
          {/each}
        {/if}
      </div>
    </section>
  </div>

  <aside class="w-full md:w-[300px] flex-shrink-0">
    <div class="sticky top-6">
        <RelatedTools {lang} />
    </div>
  </aside>
</main>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
