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

<div class="absolute inset-0 z-50 bg-white/65 backdrop-blur-[1px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300" style="margin-top: 0;">
    
    <div class="relative w-52 h-52 md:w-60 md:h-60 flex items-center justify-center">
        
        <div class="absolute inset-0 border-2 border-[#10b981]/20 shadow-2xl drop-shape overflow-hidden bg-white/40">
            
            <div 
                class="absolute inset-x-0 bottom-0 bg-[#10b981] transition-all duration-1000 ease-linear"
                style="height: {$animatedProgress}%"
            >
                <div class="wave wave-back"></div>
                <div class="wave wave-front"></div>
            </div>

            <div class="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                <div class="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    {currentIndex} / {totalFiles}
                </div>
                <div class="flex items-baseline font-black tracking-tighter text-slate-800">
                    <span class="text-6xl md:text-7xl">
                        {$animatedProgress.toFixed(0)}
                    </span>
                    <span class="text-xl ml-1 opacity-40">%</span>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Hình dáng giọt nước organic */
    .drop-shape {
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        animation: morph 6s ease-in-out infinite;
    }

    /* Lớp sóng chung */
    .wave {
        position: absolute;
        top: -28px; /* Khớp với chiều cao wave trong SVG */
        left: 0;
        width: 200%;
        height: 30px;
        background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1000 100" xmlns="http://www.w3.org/2000/svg"><path d="M0,50 C150,150 350,-50 500,50 C650,150 850,-50 1000,50 V100 H0 Z" fill="%2310b981"/></svg>');
        background-size: 50% 100%;
        transform: translate3d(0, 0, 0); /* Ép GPU xử lý cho mượt */
    }

    /* Sóng trước: Chạy nhanh hơn */
    .wave-front {
        animation: wave-move 3s linear infinite;
        z-index: 20;
        opacity: 1;
    }

    /* Sóng sau: Chạy chậm, ngược chiều và nhạt hơn tạo độ sâu */
    .wave-back {
        animation: wave-move 6s linear infinite reverse;
        z-index: 10;
        opacity: 0.4;
        filter: brightness(0.9);
        top: -32px; /* Lệch lên một chút so với sóng trước */
    }

    @keyframes wave-move {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }

    @keyframes morph {
        0%, 100% { border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; transform: scale(1); }
        50% { border-radius: 45% 55% 45% 55% / 55% 45% 55% 45%; transform: scale(1.03); }
    }
</style>
