<script lang="ts">
    import { X, Trash2, Download } from "lucide-svelte";
    
    export let fileQueue: any[];
    export let status: "idle" | "selected" | "processing" | "success";
    export let t: any;
    export let onClose: () => void;
    export let onRemove: (i: number) => void;
    export let onDownload: (item: any) => void; 
    export let formatBytes: (bytes: number) => string;
    export let getSavedPercentage: (original: number, result: number) => string;
    export let isCompressor: boolean = true;

    // Giữ extension để user nhận diện định dạng file
    function middleTruncate(str: string, maxLength: number = 32) {
        if (!str || str.length <= maxLength) return str;
        const extIndex = str.lastIndexOf('.');
        const ext = extIndex !== -1 ? str.substring(extIndex) : '';
        const name = extIndex !== -1 ? str.substring(0, extIndex) : str;
        const available = maxLength - ext.length - 3;
        if (available <= 0) return "..." + ext;
        const front = Math.ceil(available / 2);
        const back = Math.floor(available / 2);
        return name.substring(0, front) + "..." + name.substring(name.length - back) + ext;
    }
</script>

<div class="absolute inset-0 bg-white z-20 flex flex-col h-full border border-gray-300 rounded-sm shadow-lg overflow-hidden" style="margin-top: 0;">
    <div class="flex justify-between items-center px-4 pt-6 mb-4">
        <h3 class="mono text-[11px] text-gray-500 uppercase tracking-widest font-bold">
            {status === "success" ? t.common.processedFiles : t.common.selectedFiles}
        </h3>
        <button onclick={onClose} class="text-gray-500 hover:text-gray-700 transition-colors">
            <X class="w-5 h-5" />
        </button>
    </div>

    <div class="flex-grow overflow-auto px-4 pb-6">
        <ul class="space-y-2">
            {#each fileQueue as item, i}
                <li class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-sm border border-gray-100 hover:border-gray-300 transition-all">
                    <div class="flex flex-col min-w-0 flex-1 mr-3">
                        {#if status === "success"}
                            <span class="text-[10px] text-gray-400 mono truncate mb-0.5">
                                {middleTruncate(item.file.name)}
                            </span>
                            
                            <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span class="text-sm font-bold text-gray-800 truncate">
                                    {middleTruncate(item.resultName || item.file.name)}
                                </span>
                                <div class="flex items-center gap-1.5 flex-shrink-0">
                                    <span class="text-[10px] px-1 py-0.5 bg-white border border-gray-200 text-gray-500 rounded-sm font-mono uppercase">
                                        {formatBytes(item.resultSize)}
                                    </span>
                                    {#if isCompressor && item.resultSize < item.file.size}
                                        <span class="text-[10px] text-[#10b981] font-bold">
                                            -{getSavedPercentage(item.file.size, item.resultSize)}%
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        {:else}
                            <span class="text-sm font-medium text-gray-800 truncate">{middleTruncate(item.file.name)}</span>
                            <span class="text-xs text-gray-500 mono">{formatBytes(item.file.size)}</span>
                        {/if}
                    </div>

                    <div class="flex items-center gap-2 flex-shrink-0">
                        {#if status === "selected"}
                            <button onclick={() => onRemove(i)} class="text-red-400 hover:text-red-600 p-1.5">
                                <Trash2 class="w-4 h-4" />
                            </button>
                        {:else if status === "success"}
                            <button 
                                onclick={() => onDownload(item)} 
                                class="p-2 border border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-white rounded-sm transition-all shadow-sm bg-white"
                                title={t.common.downloadFile}
                            >
                                <Download class="w-4 h-4" />
                            </button>
                        {/if}
                    </div>
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
