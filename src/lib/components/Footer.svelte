<script lang="ts">
  import { page } from '$app/stores';
  import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
  import { ui } from '$lib/data/ui';

  // 1. Lấy Lang hiện tại từ params giống hệt Header/Home
  $: lang = (siteConfig.languages.find(
    (l) => l.path.toLowerCase() === $page.params.lang?.toLowerCase()
  )?.id || siteConfig.defaultLang) as SupportedLang;

  // 2. Lấy data text UI
  $: t = ui[lang].footer;
  
  // 3. Tiền tố cho link (nếu cần dùng cho các trang nội bộ như Privacy)
  $: langConfig = siteConfig.languages.find(l => l.id === lang);
  $: prefix = langConfig?.path ? `/${langConfig.path}` : '';
</script>

<hr class="w-full" />

<footer class="w-full py-4">
  <div class="max-w-[960px] mx-auto px-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div class="mono text-[11px] uppercase tracking-widest text-gray-500">
        ToolKuai © 2026 / {t.builtFor}
      </div>
      
      <div class="flex space-x-8 mt-6 md:mt-0 mono text-[11px] uppercase tracking-widest font-medium text-gray-500">
        <a href="#" class="hover:underline hover:decoration-yellow-400 hover:underline-offset-4 px-1">
          {t.privacy}
        </a>
        <a href="https://github.com/your-repo" target="_blank" class="hover:underline hover:decoration-yellow-400 hover:underline-offset-4 px-1">
          {t.github}
        </a>
        <a href="#" class="hover:underline hover:decoration-yellow-400 hover:underline-offset-4 px-1">
          {t.contact}
        </a>
      </div>
    </div>
  </div>
</footer>
