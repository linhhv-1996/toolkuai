<script lang="ts">
  import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
  import { ui } from '$lib/data/ui';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let { lang }: { lang: SupportedLang } = $props();
  const t = $derived(ui[lang]);
  const langPath = $derived(
    siteConfig.languages.find((l) => l.id === lang)?.path
      ? `/${siteConfig.languages.find((l) => l.id === lang)?.path}`
      : ""
  );

  function handleLangChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const newLangId = target.value;
    const selected = siteConfig.languages.find(l => l.id === newLangId);
    if (!selected) return;
    const currentPathname = $page.url.pathname;
    const segments = currentPathname.split('/').filter(Boolean);
    const firstSegmentIsLang = siteConfig.languages.some(
      l => l.path !== '' && l.path.toLowerCase() === segments[0]?.toLowerCase()
    );
    if (firstSegmentIsLang) segments.shift();
    if (selected.path !== '') segments.unshift(selected.path);
    const newPath = '/' + segments.join('/');
    goto(newPath);
  }
</script>

<nav class="max-w-[972px] mx-auto py-3 md:py-3 px-4 md:px-4 flex flex-wrap justify-between items-center gap-4 md:gap-0">
  <a href={langPath || '/'} class="flex items-center group gap-2 md:gap-0">
    <div class="p-1 transition-all duration-300">
      <img
        src="/logo.svg"  
        alt="ToolKuai.com"
        class="w-10 h-10 object-contain group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"
      />
    </div>
    <div class="flex flex-col -ml-1 md:ml-0">
      <span class="text-lg md:text-2xl font-black tracking-tight text-slate-900 transition-colors">
        Toolkuai
      </span>
      <span class="text-[10px] md:text-xs text-gray-500 -mt-1 leading-tight whitespace-nowrap md:whitespace-normal">
        Fast, Private Tools in Your Browser
      </span>  <!-- Tagline luôn hiển thị, responsive size & wrap -->
    </div>
  </a>
  <div class="flex items-center gap-3 md:gap-6">
    <div class="relative flex items-center">
      <!-- svelte-ignore event_directive_deprecated -->
      <select
        value={lang}
        on:change={handleLangChange}
        class="appearance-none bg-gray-50 border border-gray-100 pl-2 md:pl-3 pr-6 md:pr-8 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-gray-600 cursor-pointer hover:border-[#10b981] hover:text-[#10b981] transition-all focus:outline-none"
      >
        {#each siteConfig.languages as l}
          <option value={l.id}>{l.label}</option>
        {/each}
      </select>
      <div class="absolute right-1.5 md:right-2.5 pointer-events-none text-gray-400">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
    <a
      href="{langPath}/blog"
      class="text-gray-500 hover:text-slate-900 transition-colors uppercase text-[9px] md:text-[11px] tracking-widest font-extrabold"
    >
      {t.nav.blog}
    </a>
  </div>
</nav>
<hr class="w-full border-gray-100" />
