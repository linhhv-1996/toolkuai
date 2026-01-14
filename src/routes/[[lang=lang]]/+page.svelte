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

  // Logic Search
  let searchQuery = $state("");

  // Tự động lấy danh sách Category IDs từ file config
  const categoryIds = Object.keys(categoryNames) as Array<
    keyof typeof categoryNames
  >;

  // Filter tools theo search và group theo category một cách tự động
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
  ); // Chỉ hiện category có tool

  const langPath = $derived(
        siteConfig.languages.find(l => l.id === lang)?.path 
        ? `/${siteConfig.languages.find(l => l.id === lang)?.path}` 
        : ''
    );

</script>

<header class="max-w-[960px] mx-auto px-6 mb-8 text-center md:text-left">
  <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-4">
    {t.hero.h1}
  </h1>

  <p class="mono text-base text-gray-600 max-w-md mb-6 mx-auto md:mx-0">
    {t.hero.h2}
    <a
      href="{langPath}/how-it-works"
      class="text-gray-800 hover:text-[#10b981] transition ml-2"
      >{t.hero.howItWorks}</a
    >
  </p>

  <input
    type="text"
    bind:value={searchQuery}
    placeholder={t.nav.searchPlaceholder}
    class="w-full max-w-[600px] mx-auto mono text-sm px-4 py-2 border border-gray-200 focus:outline-none focus:border-[#10b981] placeholder-gray-400 rounded-sm transition-colors"
  />
</header>

<main class="max-w-[960px] mx-auto px-6 mb-12 flex flex-col md:flex-row gap-6">
  <div class="w-full md:w-[630px] space-y-6">
    {#if categories.length === 0}
      <div class="mono text-xs text-gray-500 py-10 text-center">
        {t.search.notFound} "{searchQuery}"
      </div>
    {:else}
      {#each categories as category}
        <section>
          <div class="mono text-xs text-gray-500 mb-2 uppercase tracking-wider">
            {category.name}
          </div>
          <div
            class="divide-y divide-gray-200 border-t border-b border-gray-200 rounded-sm overflow-hidden"
          >
            {#each category.items as tool}
              {@const Icon = (Icons as any)[tool.icon] || Icons.HelpCircle}
              <a
                href="{langPath}/{tool.slug}"
                class="tool-item py-3 px-2 flex items-center justify-between group block hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <Icon
                    class="w-4 h-4 text-gray-500 group-hover:text-[#10b981]"
                  />
                  <div>
                    <div
                      class="tool-name font-medium text-sm group-hover:text-[#10b981] transition-colors"
                    >
                      {tool.i18n[lang].title}
                    </div>
                    <div class="mono text-xs text-gray-500 mt-1">
                      {tool.i18n[lang].description}
                    </div>
                  </div>
                </div>
                <Icons.ArrowRight
                  class="w-4 h-4 text-gray-300 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all"
                />
              </a>
            {/each}
          </div>
        </section>
      {/each}
    {/if}
  </div>

  <BlogSidebar lang={lang}/>
</main>
