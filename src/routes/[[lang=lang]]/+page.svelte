<script lang="ts">
  import { page } from "$app/state";
  import { siteConfig, type SupportedLang } from "$lib/data/siteConfig";
  import { ui } from "$lib/data/ui";
  import { tools, categoryNames } from "$lib/data/tools";
  import * as Icons from "lucide-svelte";
  import BlogSidebar from "$lib/components/BlogSidebar.svelte";

  const lang = $derived(
    (siteConfig.languages.find(
      (l) => l.path === page.params.lang?.toLowerCase(),
    )?.id || siteConfig.defaultLang) as SupportedLang,
  );
  const t = $derived(ui[lang]);

  let searchQuery = $state("");
  const categoryIds = Object.keys(categoryNames) as Array<
    keyof typeof categoryNames
  >;

  const categories = $derived(
    categoryIds
      .map((catId) => {
        const filteredTools = tools.filter((tool) => {
          const matchCategory = tool.categoryId === catId;
          const matchSearch =
            tool.i18n[lang].title
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            tool.i18n[lang].description
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          return matchCategory && (searchQuery ? matchSearch : true);
        });

        return {
          id: catId,
          name: categoryNames[catId][lang].name,
          items: filteredTools,
        };
      })
      .filter((cat) => cat.items.length > 0),
  );

  const langPath = $derived(
    siteConfig.languages.find((l) => l.id === lang)?.path
      ? `/${siteConfig.languages.find((l) => l.id === lang)?.path}`
      : "",
  );
</script>

<header class="max-w-[972px] mx-auto px-6 mb-10 mt-6 text-left md:text-left">
  <h1
    class="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-3"
  >
    {t.hero.h1}
  </h1>

  <p
    class="text-[15px] text-slate-600 max-w-lg mb-8 mx-auto md:mx-0 leading-relaxed"
  >
    {t.hero.h2}
    <a
      href="{langPath}/p/how-it-works"
      class="text-slate-900 font-bold hover:text-[#10b981] transition-colors ml-1 underline decoration-gray-200 underline-offset-4"
    >
      {t.hero.howItWorks}
    </a>
  </p>

  <div class="relative max-w-[500px] mx-auto md:mx-0">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder={t.nav.searchPlaceholder}
      class="w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] placeholder-gray-400 rounded transition-all"
    />
  </div>
</header>

<main class="max-w-[972px] mx-auto px-6 mb-20 flex flex-col md:flex-row gap-6">
  <div class="w-full md:w-[600px] space-y-10">
    {#if categories.length === 0}
      <div
        class="text-sm text-gray-500 py-12 text-center bg-gray-50 rounded italic"
      >
        {t.search.notFound} "{searchQuery}"
      </div>
    {:else}
      {#each categories as category}
        <section>
          <div
            class="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-[0.2em] ml-1"
          >
            {category.name}
          </div>
          <div
            class="divide-y divide-gray-100 border-t border-b border-gray-100 overflow-hidden"
          >
            {#each category.items as tool}
              {@const Icon = (Icons as any)[tool.icon] || Icons.HelpCircle}
              <a
                href="{langPath}/{tool.i18n[lang].slug}"
                class="py-4 px-2 flex items-start justify-between group hover:bg-gray-50 transition-all"
              >
                <div class="flex items-start space-x-4">
                  <div
                    class="mt-1 p-2 bg-slate-50 rounded group-hover:bg-white transition-colors"
                  >
                    <Icon
                      class="w-4 h-4 text-slate-400 group-hover:text-[#10b981] transition-colors"
                    />
                  </div>
                  <div>
                    <div
                      class="text-[15px] font-bold text-slate-900 group-hover:text-[#10b981] transition-colors mb-0.5"
                    >
                      {tool.i18n[lang].title}
                    </div>
                    <div
                      class="text-[13px] text-slate-600 leading-relaxed max-w-[450px]"
                    >
                      {tool.i18n[lang].description}
                    </div>
                  </div>
                </div>
                <Icons.ArrowRight
                  class="w-4 h-4 text-gray-200 mt-2 group-hover:text-slate-400 group-hover:translate-x-1 transition-all"
                />
              </a>
            {/each}
          </div>
        </section>
      {/each}
    {/if}
  </div>

  <aside class="w-[300px] flex-shrink-0">
    <div class="sticky top-4 space-y-8">
      <BlogSidebar {lang} />
    </div>
  </aside>
</main>
