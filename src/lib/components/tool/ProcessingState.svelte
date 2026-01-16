<!-- ProcessingState.svelte -->
<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    let { 
        progress, 
        t, 
        currentFileName = '', 
        showPlaceholder = false 
    }: { 
        progress: number, 
        t: any, 
        currentFileName?: string,
        showPlaceholder?: boolean 
    } = $props();

    const animatedProgress = tweened(0, { duration: 300, easing: cubicOut });

    $effect(() => {
        animatedProgress.set(progress);
    });

    const radius = 50; // Kích thước vòng tròn
    const circumference = 2 * Math.PI * radius;
    const dashoffset = $derived(circumference * (1 - ($animatedProgress / 100)));
</script>

<section class="space-y-6">
    {#if showPlaceholder}
        <div class="flex justify-center">
            <div class="w-40 h-40 bg-gray-100 rounded-full"></div>
        </div>
        <div class="text-center text-sm text-gray-600 invisible">Placeholder</div>
        <div class="p-4 bg-gray-50 rounded-lg shadow-sm mono text-[11px] text-gray-600 border border-gray-100 uppercase tracking-tight invisible">
            Placeholder
        </div>
    {:else}
        <div class="flex flex-col items-center">
            <svg class="w-40 h-40 animate-glow" viewBox="0 0 120 120"> <!-- Giảm kích thước trên mobile -->
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color: #34d399; stop-opacity: 1" /> <!-- Xanh nhạt -->
                        <stop offset="50%" style="stop-color: #10b981; stop-opacity: 1" /> <!-- Xanh trung bình -->
                        <stop offset="100%" style="stop-color: #047857; stop-opacity: 1" /> <!-- Xanh đậm hơn -->
                    </linearGradient>
                    <filter id="glowFilter">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <circle class="stroke-current text-gray-200" stroke-width="12" cx="60" cy="60" r="{radius}" fill="transparent"></circle> <!-- Tăng stroke-width để dày hơn -->
                <circle class="stroke-current transition-all duration-300 animate-rotate-slow" stroke-width="12" stroke-dasharray="{circumference}" stroke-dashoffset="{dashoffset}" cx="60" cy="60" r="{radius}" fill="transparent" stroke-linecap="round" style="transform: rotate(-90deg); transform-origin: 50% 50%; stroke: url(#progressGradient); filter: url(#glowFilter);"></circle> <!-- Gradient và glow filter -->
                <text x="60" y="60" font-size="24" md:font-size="28" text-anchor="middle" dominant-baseline="central" class="fill-current text-gray-800 font-extrabold animate-pulse">{$animatedProgress.toFixed(0)}%</text>
            </svg>
            {#if currentFileName}
                <div class="mt-4 text-center text-sm md:text-base text-gray-700 font-medium max-w-full md:max-w-md">
                    Processing: {currentFileName}
                </div>
            {/if}
        </div>
        
    {/if}
</section>

<style>
    svg {
        filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3)); /* Shadow xanh mạnh hơn cho glow */
    }
    .animate-glow {
        animation: glow 2s ease-in-out infinite alternate;
    }
    @keyframes glow {
        from {
            filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.2));
        }
        to {
            filter: drop-shadow(0 6px 16px rgba(16, 185, 129, 0.4));
        }
    }
    .animate-rotate-slow {
        animation: rotate 20s linear infinite; /* Rotate nhẹ để thêm động */
    }
    @keyframes rotate {
        from {
            transform: rotate(-90deg);
        }
        to {
            transform: rotate(270deg);
        }
    }
    .animate-pulse {
        animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.05);
        }
    }
</style>
