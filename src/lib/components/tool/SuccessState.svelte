<!-- SuccessState.svelte -->
<script lang="ts">
    import { CheckCircle2, FileDown, Clock, Percent } from "lucide-svelte";

    let { 
        processingTime,
        customInfo,
        zipUrl, 
        onReset, 
        t, 
        onViewFiles
    }: { 
        processingTime: string, 
        customInfo: string, 
        zipUrl: string | null, 
        onReset: () => void, 
        t: any, 
        onViewFiles: () => void 
    } = $props();
</script>

<section class="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col min-h-[300px]">
    <!-- Header: Centered large icon for emphasis -->
    <div class="flex-shrink-0 px-6 py-4 bg-green-50 border-b border-green-100 flex items-center justify-center">
        <CheckCircle2 class="w-12 h-12 text-[#10b981] flex-shrink-0" />
    </div>

    <!-- Content: Flexible, centered items, no fixed min-height -->
    <div class="flex-grow px-6 py-4 space-y-3 bg-white flex flex-col justify-center items-center">
        <!-- Dòng 1: Thời gian xử lý - only icon and value, centered -->
        <div class="flex items-center space-x-2 justify-center w-full">
            <Clock class="w-4 h-4 text-slate-600 flex-shrink-0" />
            <span class="mono text-[13px] text-slate-600 font-medium uppercase tracking-tight">
                {processingTime}
            </span>
        </div>
        
        <!-- Dòng 2: Tùy chỉnh theo tool - icon and value, centered -->
        <div class="flex items-center space-x-2 justify-center w-full">
            <Percent class="w-4 h-4 text-slate-600 flex-shrink-0" />
            <div class="mono text-[13px] text-slate-600 font-medium uppercase tracking-tight">
                {@html customInfo}
            </div>
        </div>
        
        <!-- Link view files - smaller text, centered -->
        <button onclick={onViewFiles} class="text-[#10b981] hover:text-green-700 hover:underline mono text-[11px] uppercase tracking-tight font-bold transition-colors w-full text-center mt-2">
            {t.common.viewFiles}
        </button>
    </div>

    <!-- Action Area: Bottom-aligned, increased padding to ensure visibility -->
    <div class="flex-shrink-0 px-0 py-4 bg-white space-y-2 border-t border-gray-100">
        {#if zipUrl}
            <a href={zipUrl} download="toolkuai_files.zip" class="block w-full bg-[#10b981] text-white mono text-[13px] py-3 rounded-sm hover:bg-green-700 transition flex items-center justify-center space-x-1.5 font-bold uppercase tracking-wider">
                <FileDown class="w-3.5 h-3.5" />
                <span>{t.common.downloadAll}</span>
            </a>
        {/if}
        <button onclick={onReset} class="block w-full border border-[#10b981] text-[#10b981] mono text-[13px] py-2.5 rounded-sm hover:bg-green-50 transition font-bold uppercase tracking-wider">
            {t.common.newTask}
        </button>
    </div>
</section>

<style>
    /* Remove overflow hidden to prevent cutting */
    section {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        overflow: visible;
    }

    /* Responsive adjustments - reduce sizes on desktop and mobile */
    @media (min-width: 769px) {
        /* Desktop tweaks - ensure enough space */
        .py-4 {
            padding-top: 1rem;
            padding-bottom: 1rem;
        }
        .space-y-3 {
            space-y: 0.75rem;
        }
        .space-y-2 {
            space-y: 0.5rem;
        }
        .w-12 {
            width: 2.5rem;
            height: 2.5rem;
        }
        .w-4 {
            width: 1rem;
            height: 1rem;
        }
        .text-\[12px\] {
            font-size: 11px;
        }
        .text-\[10px\] {
            font-size: 9px;
        }
        .py-2\.5 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }
    }

    /* Mobile-specific tweaks */
    @media (max-width: 768px) {
        .w-12 {
            width: 2.25rem;
            height: 2.25rem;
        }
        .w-4 {
            width: 0.875rem;
            height: 0.875rem;
        }
        .text-\[12px\] {
            font-size: 10px;
        }
        .text-\[10px\] {
            font-size: 8px;
        }
        .py-4 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
        }
        .py-2\.5 {
            padding-top: 0.375rem;
            padding-bottom: 0.375rem;
        }
        .space-y-3 {
            space-y: 0.5rem;
        }
        .space-y-2 {
            space-y: 0.375rem;
        }
        .px-6 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
        }
        /* Ensure text wraps */
        .flex-grow {
            word-break: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
        }
    }
</style>
