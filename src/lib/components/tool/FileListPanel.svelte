<!-- $lib/components/tool/FileListPanel.svelte (sửa cuối cùng) -->
<script lang="ts">
    import { X, Trash2 } from "lucide-svelte";

    export let videoQueue: any[];
    export let status: "idle" | "selected" | "processing" | "success";
    export let t: any;
    export let onClose: () => void;
    export let onRemove: (i: number) => void;
    export let formatBytes: (bytes: number) => string;
    export let getSavedPercentage: (original: number, result: number) => string;
</script>

<div class="absolute inset-0 bg-white z-10 flex flex-col h-full border border-gray-300 rounded-sm shadow-lg" style="box-sizing: border-box; overflow: hidden; margin-top: 0"> <!-- THÊM: overflow: hidden; để ngăn scroll panel chính -->
    <div class="flex justify-between items-center mb-4 px-6 pt-6"> <!-- Header không scroll -->
        <h3 class="mono text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
            {#if status === "success"}
                {t.common.compressedFiles}
            {:else}
                {t.common.selectedFiles}
            {/if}
        </h3>
        <button onclick={onClose} class="text-gray-500 hover:text-gray-700 transition-colors">
            <X class="w-5 h-5" />
        </button>
    </div>
    <div class="flex-grow overflow-auto px-6 pb-6" style="box-sizing: border-box;"> <!-- Chỉ list scroll, thêm box-sizing nếu cần -->
        <!-- FileList nếu có, hoặc list custom -->
        <ul class="space-y-3">
            {#each videoQueue as item, i}
                <li class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors">
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-800">{item.file.name}</span>
                        {#if status === "success" && item.resultSize !== undefined}
                            <span class="text-xs text-gray-500">
                                {formatBytes(item.file.size)} → {formatBytes(item.resultSize)} 
                                ({getSavedPercentage(item.file.size, item.resultSize)}% saved)
                            </span>
                        {:else}
                            <span class="text-xs text-gray-500">{formatBytes(item.file.size)}</span>
                        {/if}
                    </div>
                    {#if status === "selected"}
                        <button onclick={() => onRemove(i)} class="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    /* Thêm CSS đẹp hơn nếu cần, ví dụ animation fade-in */
    div {
        animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
</style>
