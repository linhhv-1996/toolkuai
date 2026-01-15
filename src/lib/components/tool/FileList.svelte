<!-- <script lang="ts">
    import { FileVideo, Trash2, CheckCircle2, AlertCircle } from "lucide-svelte";
    let { files, onRemove, t, maxHeight = "200px" }: { files: any[], onRemove?: (i: number) => void, t: any, maxHeight?: string } = $props();
    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + ["B", "KB", "MB", "GB"][i];
    }
</script>

<div class="border border-gray-100 bg-white rounded-sm overflow-y-auto shadow-sm" style="max-height: {maxHeight}">
    <div class="divide-y divide-gray-100">
        {#each files as item, i}
            <div class="py-2.5 px-3 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                <div class="flex items-center space-x-3 overflow-hidden">
                    <FileVideo class="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <div class="truncate">
                        <div class="text-[13px] font-bold truncate text-slate-700">{item.file?.name || item.name}</div>
                        <div class="mono text-[10px] text-slate-400 uppercase font-bold tracking-tight mt-0.5">
                            {formatBytes(item.file?.size || item.size)} 
                            {#if item.resultSize} → <span class="text-[#10b981]">{formatBytes(item.resultSize)}</span>{/if}
                        </div>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    {#if item.status === 'processing'}
                        <span class="mono text-[10px] text-[#10b981] font-bold">{item.progress}%</span>
                    {:else if item.status === 'done'}
                        <CheckCircle2 class="w-4 h-4 text-[#10b981]" />
                    {:else if item.status === 'error'}
                        <AlertCircle class="w-4 h-4 text-red-500" />
                    {:else if onRemove}
                        <button onclick={() => onRemove(i)} class="p-1.5 text-slate-200 hover:text-red-500 transition-all">
                            <Trash2 class="w-3.5 h-3.5" />
                        </button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div> -->


<script lang="ts">
    import { FileVideo, Trash2, CheckCircle2, AlertCircle } from "lucide-svelte";
    let { files, onRemove, t, maxHeight = "200px", showPlaceholder = false }: { files: any[], onRemove?: (i: number) => void, t: any, maxHeight?: string, showPlaceholder?: boolean } = $props();
    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + ["B", "KB", "MB", "GB"][i];
    }
</script>

<div class="border border-gray-100 bg-white rounded-sm overflow-y-auto shadow-sm" style="max-height: {maxHeight}; min-height: {maxHeight};">
    <div class="divide-y divide-gray-100">
        {#if showPlaceholder}
            <div class="py-2.5 px-3 flex items-center justify-center text-gray-400 mono text-[12px]">
                {t.common.noFilesSelected}
            </div>
        {:else}
            {#each files as item, i}
                <div class="py-2.5 px-3 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                    <div class="flex items-center space-x-3 overflow-hidden">
                        <FileVideo class="w-4 h-4 text-slate-300 flex-shrink-0" />
                        <div class="truncate">
                            <div class="text-[13px] font-bold truncate text-slate-700">{item.file?.name || item.name}</div>
                            <div class="mono text-[10px] text-slate-400 uppercase font-bold tracking-tight mt-0.5">
                                {formatBytes(item.file?.size || item.size)} 
                                {#if item.resultSize} → <span class="text-[#10b981]">{formatBytes(item.resultSize)}</span>{/if}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        {#if item.status === 'processing'}
                            <span class="mono text-[10px] text-[#10b981] font-bold">{item.progress}%</span>
                        {:else if item.status === 'done'}
                            <CheckCircle2 class="w-4 h-4 text-[#10b981]" />
                        {:else if item.status === 'error'}
                            <AlertCircle class="w-4 h-4 text-red-500" />
                        {:else if onRemove}
                            <button onclick={() => onRemove(i)} class="p-1.5 text-slate-200 hover:text-red-500 transition-all">
                                <Trash2 class="w-3.5 h-3.5" />
                            </button>
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
