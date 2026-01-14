<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { siteConfig, type SupportedLang } from '$lib/data/siteConfig';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();

  // Reactive lang: Tự cập nhật khi URL thay đổi
  const lang = $derived((
    siteConfig.languages.find(l => l.path === page.params.lang?.toLowerCase())?.id || 
    siteConfig.defaultLang
  ) as SupportedLang);
</script>

<Header {lang} />

{@render children()}

<Footer {lang} />
