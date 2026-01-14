<script>
  export let href;
  export let name;
  export let description;
  export let iconName; // e.g., 'zap'
  export let secondaryIcon = 'arrow-right';

  // Import all needed icons explicitly (thêm hết icon bạn dùng từ data)
  import { 
    Zap, Repeat, Music, Film, Image, FileImage, Minimize2, Mic, Mic2, Shuffle, FileText,
    BookOpen, Video, Sparkles, ArrowRight 
  } from 'lucide-svelte';

  // Map iconName to component (thay vì * as icons)
  const iconMap = {
    zap: Zap,
    repeat: Repeat,
    music: Music,
    film: Film,
    image: Image,
    'file-image': FileImage,
    'minimize-2': Minimize2,
    mic: Mic,
    'mic-2': Mic2,
    shuffle: Shuffle,
    'file-text': FileText,
    'book-open': BookOpen,
    video: Video,
    sparkles: Sparkles,
    'arrow-right': ArrowRight  // For secondary
  };

  // @ts-ignore
  const Icon = iconMap[iconName];
  // @ts-ignore
  const SecondaryIcon = iconMap[secondaryIcon];
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
  <div class="flex items-center space-x-4 text-gray-300 group-hover:text-black transition">
    {#if Icon}
      <svelte:component this={Icon} class="w-4 h-4" />
    {/if}
    {#if SecondaryIcon}
      <svelte:component this={SecondaryIcon} class="w-4 h-4 group-hover:translate-x-1 transition" />
    {/if}
  </div>
</a>
