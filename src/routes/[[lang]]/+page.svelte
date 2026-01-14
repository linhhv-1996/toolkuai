
<script lang="ts">
  import { page } from '$app/stores';
  import { tools, categoryNames } from '$lib/data/tools';
  import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
  import { ui } from '$lib/data/ui';
  import ToolItem from '$lib/components/ToolItem.svelte';
  import BlogItem from '$lib/components/BlogItem.svelte';

  // 1. Xác định ngôn ngữ hiện tại dựa trên siteConfig
  // Tìm trong list languages xem có path nào khớp với params.lang không, không thì dùng default
  $: lang = (siteConfig.languages.find(
    (l) => l.path.toLowerCase() === $page.params.lang?.toLowerCase()
  )?.id || siteConfig.defaultLang) as SupportedLang;

  $: t = ui[lang];

  // 2. Định nghĩa kiểu dữ liệu để fix lỗi "implicitly has an any type"
  interface GroupedCategory {
    name: string;
    items: Array<{
      href: string;
      name: string;
      description: string;
      icon: any;
    }>;
  }

  // 3. Nhóm tools theo Category và xử lý Đa ngôn ngữ
  $: groupedTools = tools.reduce((acc, tool) => {
    const cid = tool.categoryId;
    
    // Tìm config của ngôn ngữ hiện tại để lấy đúng path prefix (ví dụ: /zh-tw hoặc rỗng)
    const langConfig = siteConfig.languages.find(l => l.id === lang);
    const prefix = langConfig?.path ? `/${langConfig.path}` : '';

    if (!acc[cid]) {
      acc[cid] = {
        name: categoryNames[cid][lang]?.name || cid,
        items: []
      };
    }
    
    acc[cid].items.push({
      // Tạo href chuẩn: không bao giờ bị dính double slash //
      href: `${prefix}/${tool.slug}`.replace(/\/+/g, '/'),
      name: tool.i18n[lang].title,
      description: tool.i18n[lang].description,
      icon: tool.icon
    });
    
    return acc;
  }, {} as Record<string, GroupedCategory>);

  $: categories = Object.keys(groupedTools);

  const blogs = [
    { href: '/blog/post-1', name: 'How Local Processing Saves Your Privacy', description: 'Discover why ToolKuai keeps everything on-device · Jan 14, 2026', iconName: 'book-open' },
    { href: '/blog/post-2', name: 'Top Tips for Video Compression', description: 'Optimize your videos without losing quality · Jan 10, 2026', iconName: 'video' },
    { href: '/blog/post-3', name: 'New Features in ToolKuai v2.1', description: 'Upcoming updates and how they improve local tools · Jan 5, 2026', iconName: 'sparkles' },
  ];
</script>

<main class="max-w-[960px] mx-auto px-6 mb-12 flex flex-col md:flex-row gap-8">
  <div class="w-full md:w-7/12 space-y-8">
    {#each categories as cid, index}
      <section>
        <div class="mono text-[11px] tracking-[0.3em] uppercase text-gray-300 mb-2">
          {String(index + 1).padStart(2, '0')} // {groupedTools[cid].name}
        </div>
        <div class="divide-y divide-gray-100">
          {#each groupedTools[cid].items as tool}
            <ToolItem 
              href={tool.href}
              name={tool.name}
              description={tool.description}
              icon={tool.icon}
            />
          {/each}
        </div>
      </section>
    {/each}
  </div>

  <div class="w-full md:w-5/12 sticky top-4 self-start">
    <div class="mono text-[11px] tracking-[0.3em] uppercase text-gray-300 mb-2">
      {String(categories.length + 1).padStart(2, '0')} // {t.nav.blog}
    </div>
    <div class="divide-y divide-gray-100">
      {#each blogs as blog}
        <BlogItem {...blog} />
      {/each}
    </div>
    
    <a 
      href={lang === siteConfig.defaultLang ? '/blog' : `/${$page.params.lang}/blog`} 
      class="mono text-[12px] uppercase text-gray-500 hover:text-black transition block text-left mt-6"
    >
      {lang === 'en' ? 'View All Posts' : '閱讀所有文章'} →
    </a>
  </div>
</main>