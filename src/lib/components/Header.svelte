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

<nav class="max-w-[960px] mx-auto py-3 px-6 flex justify-between items-center">
  <div>
    <a href={lang === siteConfig.defaultLang ? '/' : `/${lang.toLowerCase()}`} class="text-xl font-medium tracking-tight">
      ToolKuai
    </a>
    <div class="mono text-xs text-gray-500 mt-1">Version 2.0.26 / Local Engine</div>
  </div>
  <div class="mono text-xs space-x-4 flex items-center">
    <select value={lang} onchange={handleLangChange} class="bg-transparent border-none focus:outline-none cursor-pointer hover:text-[#10b981] transition">
      {#each siteConfig.languages as l}
        <option value={l.id}>{l.label}</option>
      {/each}
    </select>
    <a href="/blog" class="hover:text-[#10b981] transition">{t.nav.blog}</a>
  </div>
</nav>
<hr class="w-full mb-6 border-gray-200" />
