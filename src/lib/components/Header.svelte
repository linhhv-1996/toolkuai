<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
  import { ui } from '$lib/data/ui';

  // Lấy ngôn ngữ hiện tại từ URL params, fallback về defaultLang
  $: lang = (siteConfig.languages.find(
    l => l.path.toLowerCase() === $page.params.lang?.toLowerCase()
  )?.id || siteConfig.defaultLang) as SupportedLang;

  $: t = ui[lang];

  function handleLangChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const newLangId = target.value as SupportedLang;
    const selectedLang = siteConfig.languages.find(l => l.id === newLangId);
    
    // Logic chuyển hướng: nếu là defaultLang thì về root /, nếu không thì thêm prefix path
    const currentPath = $page.url.pathname.replace(/^\/(zh-tw|en)/i, '') || '/';
    const newPath = selectedLang?.path ? `/${selectedLang.path}${currentPath}` : currentPath;
    
    goto(newPath.replace(/\/+$/, '') || '/');
  }
</script>

<nav class="max-w-[960px] mx-auto py-2 px-6 flex justify-between items-center">
  <div>
    <a href={lang === siteConfig.defaultLang ? '/' : `/${$page.params.lang}`} class="text-2xl font-bold tracking-tighter uppercase block">
      ToolKuai
    </a>
    <div class="mono text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-1">
      // {t.footer.builtFor}
    </div>
  </div>
  <div class="mono text-[11px] uppercase tracking-wider space-x-4 flex items-center">
    <select on:change={handleLangChange} value={lang} class="bg-transparent focus:outline-none cursor-pointer">
      {#each siteConfig.languages as l}
        <option value={l.id}>{l.label}</option>
      {/each}
    </select>
    <a href={lang === siteConfig.defaultLang ? '/blog' : `/${$page.params.lang}/blog`} 
       class="hover:underline hover:decoration-yellow-400 hover:underline-offset-4">
       {t.nav.blog}
    </a>
  </div>
</nav>

<hr class="w-full mb-8" />

<header class="max-w-[960px] mx-auto px-6 mb-10 text-center md:text-left">
  <h1 class="text-5xl md:text-6xl font-light leading-[1.1] tracking-tighter mb-6">
    {t.hero.lightning} <br />
    <span class="font-bold underline decoration-yellow-400 underline-offset-4">
      {t.hero.local}
    </span> {t.hero.processing}
  </h1>

  <p class="mono text-sm uppercase tracking-widest text-gray-500 max-w-md mb-8 mx-auto md:mx-0">
    {t.hero.kuaiDesc} {t.hero.privacyDesc}
    <a href="/how-it-works" class="text-black hover:underline hover:decoration-yellow-400 hover:underline-offset-4 ml-2">
      {t.hero.howItWorks}
    </a>
  </p>

  <input 
    id="toolSearch" 
    type="text" 
    placeholder={t.nav.searchPlaceholder} 
    class="w-full max-w-[600px] mx-auto mono text-sm uppercase tracking-widest px-4 py-2.5
           border border-black focus:outline-none focus:border-yellow-400 placeholder-gray-400" 
  />
</header>
