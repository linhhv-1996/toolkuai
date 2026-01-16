<script lang="ts">
  import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
  import { ui } from '$lib/data/ui';
  import { goto } from '$app/navigation';
  import { page } from '$app/state'; // Import page state để lấy url hiện tại

  let { lang }: { lang: SupportedLang } = $props();
  const t = $derived(ui[lang]);

  // 1. Fix đường dẫn cho Blog và Home
  const langPath = $derived(
    siteConfig.languages.find((l) => l.id === lang)?.path
      ? `/${siteConfig.languages.find((l) => l.id === lang)?.path}`
      : ""
  );

  // 2. Fix logic chuyển vùng (stay on page)
  function handleLangChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const newLangId = target.value;
    const selected = siteConfig.languages.find(l => l.id === newLangId);
    
    if (!selected) return;

    const currentPathname = page.url.pathname;
    const segments = currentPathname.split('/').filter(Boolean);
    
    // Kiểm tra xem segment đầu tiên có phải là mã ngôn ngữ không (ví dụ: 'zh-tw')
    // Loại trừ 'en' vì path của nó là ''
    const firstSegmentIsLang = siteConfig.languages.some(
      l => l.path !== '' && l.path.toLowerCase() === segments[0]?.toLowerCase()
    );

    if (firstSegmentIsLang) {
      segments.shift(); // Xóa prefix ngôn ngữ cũ
    }

    // Thêm prefix mới nếu không phải ngôn ngữ mặc định
    if (selected.path !== '') {
      segments.unshift(selected.path);
    }

    const newPath = '/' + segments.join('/');
    goto(newPath);
  }
</script>

<nav class="max-w-[972px] mx-auto py-4 px-6 flex justify-between items-center">
  <div class="flex flex-col">
    <a href={langPath || '/'} 
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
    
    <a href="{langPath}/blog" class="text-gray-600 hover:text-[#10b981] transition-colors uppercase text-[11px] tracking-widest font-bold">
      {t.nav.blog}
    </a>
  </div>
</nav>
<hr class="w-full border-gray-100" />
