<script lang="ts">
  import { ui } from '$lib/data/ui';
  import type { SupportedLang } from '$lib/data/siteConfig';
  let { lang }: { lang: SupportedLang } = $props();
  const t = $derived(ui[lang].footer);
</script>

<footer class="w-full py-8 border-t border-gray-100 bg-gray-50/30">
  <div class="max-w-[960px] mx-auto px-6">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
        ToolKuai © 2026 — {t.builtFor}
      </div>
      <div class="flex space-x-6 text-[11px] font-bold uppercase tracking-widest">
        <a href="#" class="text-gray-500 hover:text-[#10b981] transition-colors">{t.privacy}</a>
        <a href="#" class="text-gray-500 hover:text-[#10b981] transition-colors">{t.github}</a>
        <a href="#" class="text-gray-500 hover:text-[#10b981] transition-colors">Contact</a>
      </div>
    </div>
  </div>
</footer>
