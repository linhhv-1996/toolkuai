<script lang="ts">
  import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
  import { ui } from '$lib/data/ui';
  import { goto } from '$app/navigation';

  let { lang }: { lang: SupportedLang } = $props();
  const t = $derived(ui[lang]);

  function handleLangChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const selected = siteConfig.languages.find(l => l.id === target.value);
    if (selected) {
      goto(selected.path === '' ? '/' : `/${selected.path}`);
    }
  }
</script>

<nav class="max-w-[960px] mx-auto py-4 px-6 flex justify-between items-center">
  <div class="flex flex-col">
    <a href={lang === siteConfig.defaultLang ? '/' : `/${lang.toLowerCase()}`} 
       class="text-lg font-bold tracking-tight text-slate-900 hover:text-[#10b981] transition-colors">
      ToolKuai
    </a>
    <div class="mono text-[10px] text-gray-400 leading-none mt-1 uppercase tracking-tighter">
      V 2.0.26 / Local Engine
    </div>
  </div>
  <div class="flex items-center space-x-5 text-sm font-medium">
    <select value={lang} onchange={handleLangChange} 
            class="bg-transparent border-none focus:outline-none cursor-pointer text-gray-600 hover:text-[#10b981] transition-colors">
      {#each siteConfig.languages as l}
        <option value={l.id}>{l.label}</option>
      {/each}
    </select>
    <a href="/blog" class="text-gray-600 hover:text-[#10b981] transition-colors uppercase text-[11px] tracking-widest font-bold">
      {t.nav.blog}
    </a>
  </div>
</nav>
<hr class="w-full border-gray-100" />
