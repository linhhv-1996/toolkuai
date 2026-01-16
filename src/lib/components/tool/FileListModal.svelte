<script lang="ts">
    import { X, Trash2, FileVideo } from "lucide-svelte";
    let { videoQueue, status, t, onRemove, onClose, formatBytes, getSavedPercentage } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onclick={onClose}>
    <div class="bg-white rounded-sm border border-gray-200 shadow-sm max-w-lg w-full max-h-[400px] overflow-hidden flex flex-col" onclick={(e) => e.stopPropagation()}>
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-900 tracking-wider mono uppercase">{status === "selected" ? t.common.selectedFiles : t.common.compressedFiles}</h3>
            <button class="text-gray-500 hover:text-gray-700 transition-colors" onclick={onClose}>
                <X class="w-4 h-4" />
            </button>
        </div>
        <div class="overflow-y-auto flex-grow">
            <div class="divide-y divide-gray-200">
                {#each videoQueue as item, i}
                    <div class="py-2 px-4 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                        <div class="flex items-center space-x-3 overflow-hidden">
                            <FileVideo class="w-4 h-4 text-[#10b981] flex-shrink-0" />
                            <div class="truncate min-w-0">
                                <div class="text-xs font-semibold truncate text-gray-800 mono">{item.file?.name || item.name}</div>
                                {#if status === "selected"}
                                    <div class="mono text-[11px] text-gray-500 uppercase font-medium tracking-tight mt-0.5">
                                        {formatBytes(item.file?.size || item.size)}
                                    </div>
                                {:else if status === "success"}
                                    <div class="mono text-[11px] text-gray-500 uppercase font-medium tracking-tight mt-0.5">
                                        {formatBytes(item.file?.size || item.size)} → <span class="text-[#10b981] font-bold">{formatBytes(item.resultSize)}</span> ({getSavedPercentage(item.file?.size || item.size, item.resultSize)}% saved)
                                    </div>
                                {/if}
                            </div>
                        </div>
                        {#if status === "selected"}
                            <button onclick={() => onRemove(i)} class="p-1 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                                <Trash2 class="w-4 h-4" />
                            </button>
                        {/if}
                    </div>
                {/each}
                {#if videoQueue.length === 0}
                    <div class="py-4 text-center text-gray-500 mono text-xs uppercase tracking-wider">
                        {t.common.noFilesSelected}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .overflow-y-auto::-webkit-scrollbar {
        width: 4px;
    }
    .overflow-y-auto::-webkit-scrollbar-track {
        background: #f8f8f8;
    }
    .overflow-y-auto::-webkit-scrollbar-thumb {
        background: #e0e0e0;
        border-radius: 2px;
    }
    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: #cccccc;
    }
    .divide-y > :last-child {
        border-bottom: none;
    }

    @media (max-width: 640px) {
        .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
        }
        .max-w-lg {
            max-width: 100%;
        }
        .text-xs {
            font-size: 0.65rem;
        }
        
    }
</style>
