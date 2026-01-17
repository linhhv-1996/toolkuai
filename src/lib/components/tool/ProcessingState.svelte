<script lang="ts">
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    let {
        progress,
        currentIndex = 1,
        totalFiles = 1,
        t,
        currentFileName = ""
    }: {
        progress: number;
        t: any;
        currentIndex?: number;
        totalFiles?: number;
        currentFileName?: string;
    } = $props();

    const animatedProgress = tweened(0, { duration: 1000, easing: cubicOut });
    $effect(() => { animatedProgress.set(progress); });
</script>

<div class="flex flex-col h-full w-full overflow-hidden animate-in fade-in duration-700">
    <div class="flex-grow relative min-h-0 w-full overflow-hidden rounded-sm bg-slate-50 border border-gray-100 shadow-inner">
        
        <div 
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#059669] via-[#10b981] to-[#34d399] transition-all duration-1000 ease-linear"
            style="height: {$animatedProgress}%"
        >
            <div class="wave-layer wave-1 opacity-40"></div>
            <div class="wave-layer wave-2 opacity-50"></div>
            <div class="wave-layer wave-3 opacity-20"></div>

            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="bubble bubble-1"></div>
                <div class="bubble bubble-2"></div>
                <div class="bubble bubble-3"></div>
            </div>
        </div>

        <div class="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <div class="mono text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 drop-shadow-sm">
                {currentIndex} / {totalFiles} {t.common.files}
            </div>
            <div class="flex items-baseline font-black tracking-tighter">
                <span class="text-6xl md:text-7xl transition-colors duration-500 text-slate-800">
                    {$animatedProgress.toFixed(0)}
                </span>
                <span class="text-xl md:text-2xl ml-1 opacity-60 text-slate-800">%</span>
            </div>
            
            <div class="mt-4 flex items-center space-x-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-full shadow-sm">
                <div class="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse"></div>
                <span class="mono text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{t.common.processing}</span>
            </div>
        </div>

        <div 
            class="absolute inset-x-0 h-[2px] bg-white shadow-[0_0_15px_#fff] opacity-60 transition-all duration-1000 ease-linear z-10"
            style="bottom: {$animatedProgress}%"
        ></div>
    </div>

    <div class="flex-shrink-0 w-full pt-4 pb-1">
        <div class="border border-gray-100 bg-gray-50/50 rounded-sm p-3 text-center space-y-1">
            <div class="mono text-[10px] font-bold text-[#10b981] uppercase tracking-[0.2em]">
                {t.common.processing}
            </div>
            <div class="mono text-[11px] text-slate-600 truncate w-full px-4 italic">
                {currentFileName || 'Initializing...'}
            </div>
        </div>
    </div>
</div>

<style>
    .mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }

    /* Cấu trúc sóng sánh đa lớp */
    .wave-layer {
        position: absolute;
        width: 300%;
        height: 300%;
        background: white;
        left: -100%;
    }

    .wave-1 {
        border-radius: 42%;
        top: -288%;
        animation: rotate-wave 8s infinite linear;
    }

    .wave-2 {
        border-radius: 40%;
        top: -290%;
        animation: rotate-wave 13s infinite linear;
    }

    .wave-3 {
        border-radius: 38%;
        top: -292%;
        animation: rotate-wave 18s infinite linear;
    }

    /* Hiệu ứng bọt khí bay lên */
    .bubble {
        position: absolute;
        bottom: -20px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        animation: bubble-up 4s infinite ease-in;
    }
    .bubble-1 { width: 10px; height: 10px; left: 20%; animation-duration: 3s; }
    .bubble-2 { width: 6px; height: 6px; left: 50%; animation-duration: 5s; animation-delay: 1s; }
    .bubble-3 { width: 8px; height: 8px; left: 80%; animation-duration: 4s; animation-delay: 2s; }

    @keyframes rotate-wave {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes bubble-up {
        0% { transform: translateY(0); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-100px); opacity: 0; }
    }
</style>
