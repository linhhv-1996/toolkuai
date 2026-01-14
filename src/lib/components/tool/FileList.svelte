<script lang="ts">
    import { FileVideo, Trash2, CheckCircle2, AlertCircle } from "lucide-svelte";
    let { files, onRemove, t, maxHeight = "200px" }: { files: any[], onRemove?: (i: number) => void, t: any, maxHeight?: string } = $props();

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + ["B", "KB", "MB", "GB"][i];
    }
</script>

<div class="border-t border-b border-gray-200 bg-white overflow-y-auto" style="max-height: {maxHeight}">
    <div class="divide-y divide-gray-200">
        {#each files as item, i}
            <div class="py-3 px-3 flex items-center justify-between group">
                <div class="flex items-center space-x-3 overflow-hidden">
                    <FileVideo class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div class="truncate">
                        <div class="text-sm font-medium truncate text-gray-700">{item.file?.name || item.name}</div>
                        <div class="mono text-xs text-gray-400">
                            {formatBytes(item.file?.size || item.size)} 
                            {#if item.resultSize} → <span class="text-[#10b981] font-bold">{formatBytes(item.resultSize)}</span>{/if}
                        </div>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    {#if item.status === 'processing'}
                        <span class="mono text-xs text-[#10b981] font-bold">{item.progress}%</span>
                    {:else if item.status === 'done'}
                        <CheckCircle2 class="w-4 h-4 text-[#10b981]" />
                    {:else if item.status === 'error'}
                        <AlertCircle class="w-4 h-4 text-red-500" />
                    {:else if onRemove}
                        <button onclick={() => onRemove(i)} class="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>
