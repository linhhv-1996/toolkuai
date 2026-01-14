<script lang="ts">
  import { ui } from '$lib/data/ui';
  import type { SupportedLang } from '$lib/data/siteConfig';
  
  let { lang }: { lang: SupportedLang } = $props();
  const t = $derived(ui[lang].footer);
</script>

<hr class="w-full border-gray-200" />
<footer class="w-full py-6">
  <div class="max-w-[960px] mx-auto px-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div class="mono text-xs text-gray-500">ToolKuai © 2026 / {t.builtFor}</div>
      <div class="flex space-x-6 mt-4 md:mt-0 mono text-xs">
        <a href="#" class="hover:text-[#10b981] transition">{t.privacy}</a>
        <a href="#" class="hover:text-[#10b981] transition">{t.github}</a>
        <a href="#" class="hover:text-[#10b981] transition">Contact</a>
      </div>
    </div>
  </div>
</footer>
