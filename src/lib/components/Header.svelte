<script>
  import { Zap, ArrowRight } from 'lucide-svelte'; // Import icons nếu cần, nhưng ở đây không dùng trong header
</script>

<!-- NAV -->
<nav class="max-w-[960px] mx-auto py-2 px-6 flex justify-between items-center">
  <div>
    <div class="text-2xl font-bold tracking-tighter uppercase">ToolKuai</div>
    <div class="mono text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-1">
      // Built for Privacy
    </div>
  </div>
  <div class="mono text-[11px] uppercase tracking-wider space-x-4 flex items-center">
    <select class="bg-transparent border-none focus:outline-none hover:underline hover:decoration-yellow-400 hover:underline-offset-4 cursor-pointer">
      <option value="en">EN</option>
      <option value="zh-tw">ZH-TW</option>
    </select>
    <a href="#" class="hover:underline hover:decoration-yellow-400 hover:underline-offset-4">Blog</a>
  </div>
</nav>

<hr class="w-full mb-8" />

<!-- HERO -->
<header class="max-w-[960px] mx-auto px-6 mb-10 text-center md:text-left">
  <h1 class="text-5xl md:text-6xl font-light leading-[1.1] tracking-tighter mb-6">
    LIGHTNING FAST <br />
    <span class="font-bold underline decoration-yellow-400 underline-offset-4">
                LOCAL
            </span> PROCESSING.
  </h1>

  <p class="mono text-sm uppercase tracking-widest text-gray-500 max-w-md mb-8 mx-auto md:mx-0">
    Where 'Kuai' means Fast. Your data never leaves your device.
    <a href="/how-it-works" class="text-black hover:underline hover:decoration-yellow-400 hover:underline-offset-4 ml-2">How it Works →</a>
  </p>

  <!-- SEARCH -->
  <input id="toolSearch" type="text" placeholder="Search tools…" class="w-full max-w-[600px] mx-auto mono text-sm uppercase tracking-widest px-4 py-2.5
             border border-black focus:outline-none focus:border-yellow-400 placeholder-gray-400" />
</header>
