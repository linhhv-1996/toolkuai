<script>
  export let href;
  export let name;
  export let description;

  // Import all needed icons explicitly (thêm hết icon bạn dùng từ data cho blogs)
  import { 
    BookOpen, ArrowRight 
  } from 'lucide-svelte';

</script>

<a {href} class="blog-item py-4 flex items-center justify-between group">
  <div>
    <div class="blog-name font-bold uppercase text-[14px]">
      {name}
    </div>
    <div class="mono text-[13px] text-gray-500 mt-2">
      {description}
    </div>
  </div>
  <div class="flex items-center space-x-4 text-gray-300 group-hover:text-black transition">
      <svelte:component this={BookOpen} class="w-4 h-4" />
      <svelte:component this={ArrowRight} class="w-4 h-4 group-hover:translate-x-1 transition" />
  </div>
</a>
