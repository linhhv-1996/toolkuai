<script lang="ts">
  import { ui } from '$lib/data/ui';
  import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';

  let { lang }: { lang: SupportedLang } = $props();
  
  // Lấy translation cho footer
  const t = $derived(ui[lang].footer);

  // Tạo path prefix cho các link nội bộ (privacy, contact, v.v.)
  const langPath = $derived(
    siteConfig.languages.find((l) => l.id === lang)?.path
      ? `/${siteConfig.languages.find((l) => l.id === lang)?.path}`
      : ""
  );
</script>

<footer class="w-full py-6 border-t border-gray-100 bg-gray-50/30">
  <div class="max-w-[972px] mx-auto px-6">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      
      <div class="text-[12px] text-slate-400 uppercase tracking-wider font-medium">
        ToolKuai © 2026 — {t.builtFor}
      </div>

      <div class="flex space-x-6 text-[12px] font-semibold uppercase tracking-wider">
        <a href="{langPath}/p/privacy" class="text-slate-500 hover:text-[#10b981] transition-colors">
          {t.privacy}
        </a>

        <a href="{langPath}/p/terms" class="text-slate-500 hover:text-[#10b981] transition-colors">
          {t.term}
        </a>
      </div>
      
    </div>
  </div>
</footer>

