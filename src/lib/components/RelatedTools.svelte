<script lang="ts">
  import { tools } from '$lib/data/tools';
  import { siteConfig } from '$lib/data/siteConfig';
  import ToolItem from './ToolItem.svelte';

  export let currentSlug: string;
  export let lang: string;

  // Filter out current tool, take random or related (simple logic: take first 5 others)
  $: related = tools.filter(t => t.slug !== currentSlug).slice(0, 5);

  $: langConfig = siteConfig.languages.find(l => l.id === lang);
  $: prefix = langConfig?.path ? `/${langConfig.path}` : '';
</script>

<div class="w-full">
  <div class="mono text-[11px] tracking-[0.3em] uppercase text-gray-300 mb-4">
    // Related Tools
  </div>
  <div class="divide-y divide-gray-100 border-t border-b border-gray-100">
    {#each related as tool}
      <ToolItem 
        href={`${prefix}/${tool.slug}`.replace(/\/+/g, '/')}
        name={tool.i18n[lang].title}
        description={tool.i18n[lang].shortDesc}
        icon={tool.icon}
      />
    {/each}
  </div>
</div>
