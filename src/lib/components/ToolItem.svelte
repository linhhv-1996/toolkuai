<script>
  // @ts-nocheck

  export let href;
  export let name;
  export let description;
  export let icon;

  // Import all needed icons explicitly (thêm hết icon bạn dùng từ data)
  import * as Icons from "lucide-svelte";

  $: Icon = Icons[icon];
</script>

<a {href} class="tool-item py-4 flex items-center justify-between group">
  <div>
    <div class="tool-name font-bold uppercase text-[14px]">
      {name}
    </div>
    <div class="mono text-[13px] text-gray-500 mt-2">
      {description}
    </div>
  </div>
  <div
    class="flex items-center space-x-4 text-gray-300 group-hover:text-black transition"
  >
    {#if Icon}
      <svelte:component this={Icon} class="w-4 h-4" />
    {/if}
    <Icons.ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition" />
  </div>
</a>
