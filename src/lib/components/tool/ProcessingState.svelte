<script lang="ts">
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    let {
        progress,
        currentIndex = 1,
        totalFiles = 1,
        t,
        radius = 110,       // Config bán kính
        marginTop = "40px"  // Config margin
    }: {
        progress: number;
        t: any;
        currentIndex?: number;
        totalFiles?: number;
        radius?: number;
        marginTop?: string;
    } = $props();

    const animatedProgress = tweened(0, { duration: 600, easing: cubicOut });
    $effect(() => { animatedProgress.set(progress); });

    // FIX LỖI 66%: Sử dụng top dựa trên 100% chiều cao container
    // Khi progress = 0 -> top = 100% (nằm dưới đáy)
    // Khi progress = 100 -> top = 0% (đầy)
    const waveTop = $derived(100 - $animatedProgress);
</script>

<section class="flex flex-col items-center justify-center w-full" style="margin-top: {marginTop}">
    <div 
        class="relative flex items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-50 shadow-inner"
        style="width: {radius * 2}px; height: {radius * 2}px"
    >
        <div 
            class="absolute left-[-50%] w-[200%] h-[200%] bg-gradient-to-t from-[#059669] to-[#10b981] transition-all duration-500 ease-linear"
            style="top: {waveTop}%"
        >
            <div class="wave opacity-30"></div>
            <div class="wave opacity-50 animation-delay-2000"></div>
        </div>

        <div class="relative z-20 flex flex-col items-center pointer-events-none text-gray-800">
            <div 
                class="mono font-bold opacity-60 uppercase tracking-widest mb-1"
                style="font-size: {radius / 8}px"
            >
                {currentIndex} / {totalFiles}
            </div>

            <div class="flex items-baseline font-black tracking-tighter drop-shadow-sm">
                <span style="font-size: {radius / 1.8}px">{$animatedProgress.toFixed(0)}</span>
                <span style="font-size: {radius / 4}px" class="ml-1 opacity-80">%</span>
            </div>

            <div 
                class="mono uppercase tracking-[0.2em] font-bold opacity-70 mt-1" 
                style="font-size: {radius / 12}px"
            >
                {t.common.processing}
            </div>
        </div>
    </div>
</section>

<style>
    .mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }

    /* Hiệu ứng sóng: Xoay hình vuông bo góc lớn ở đỉnh khối nước */
    .wave {
        position: absolute;
        width: 100%;
        height: 100%;
        background: white;
        border-radius: 38%;
        top: -92%; /* Đặt ngay mép trên của khối gradient */
        left: 0;
        animation: rotate 8s infinite linear;
    }

    .animation-delay-2000 { animation-delay: 2s; }

    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* Đảm bảo text không bị mất màu khi nước dâng (Contrast) */
    div {
        text-shadow: 0 1px 2px rgba(255,255,255,0.5);
    }
</style>
