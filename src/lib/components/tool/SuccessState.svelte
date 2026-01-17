<script lang="ts">
    import { CheckCircle2, FileDown, Clock, Percent, ShieldCheck } from "lucide-svelte";

    let { 
        processingTime,
        customInfo,
        zipUrl, 
        onReset, 
        t, 
        onViewFiles,
        tips = "",
        showExtraInfo = false,
        headerPy = "py-3"
    }: { 
        processingTime: string, 
        customInfo: string, 
        zipUrl: string | null, 
        onReset: () => void, 
        t: any, 
        onViewFiles: () => void,
        tips?: string,
        showExtraInfo?: boolean,
        headerPy?: string // Kiểu string để truyền class Tailwind vào
    } = $props();
</script>

<section class="flex flex-col h-full w-full overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div class="flex-shrink flex items-center justify-center bg-green-50 border-b border-green-100 {headerPy} transition-all duration-300">
        <CheckCircle2 class="w-10 h-10 text-[#10b981] min-h-[32px]" />
    </div>

    <div class="flex-grow overflow-y-auto min-h-0 px-6 py-4 flex flex-col items-center scrollbar-hide">
        <div class="w-full my-auto space-y-4">
            <div class="flex items-center space-x-2 justify-center w-full">
                <Clock class="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span class="mono text-[13px] text-slate-600 font-medium uppercase tracking-tight">{processingTime}</span>
            </div>
            
            <div class="flex items-center space-x-2 justify-center w-full">
                <Percent class="w-4 h-4 text-slate-600 flex-shrink-0" />
                <div class="mono text-[13px] text-slate-600 font-medium uppercase tracking-tight">{@html customInfo}</div>
            </div>
            
            <button onclick={onViewFiles} class="text-[#10b981] hover:underline mono text-[11px] uppercase font-bold w-full text-center">
                {t.common.viewFiles}
            </button>

            {#if showExtraInfo}
                <div class="pt-4 w-full border-t border-dashed border-gray-100 flex flex-col items-center">
                    <ShieldCheck class="w-4 h-4 text-gray-400 mb-1" />
                    <p class="text-[10px] text-gray-400 text-center italic mono uppercase max-w-[180px] leading-tight">
                        {t.common.processLocaly}
                    </p>
                </div>
            {/if}
        </div>
    </div>

    <div class="flex-shrink-0 pt-2 pb-1 bg-white border-t border-gray-100">
        {#if tips}
            <p class="mono text-center text-[11px] text-slate-400 tracking-wider mb-3 px-2 italic leading-tight">
                {@html tips}
            </p>
        {/if}

        <div class="space-y-2">
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
    </div>
</section>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
