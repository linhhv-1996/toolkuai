<script lang="ts">
  import { FileVideo, CheckCircle2, AlertCircle, Loader2, Trash2, Download } from "lucide-svelte";
  import { slide } from 'svelte/transition';

  // Props
  export let file: File;
  export let status: "pending" | "processing" | "done" | "error" = "pending";
  export let progress = 0;
  export let resultSize: number | undefined = undefined;
  export let resultName: string | undefined = undefined;
  export let t: any;

  // Dispatch events for remove/download
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  $: savings = resultSize ? Math.round(((file.size - resultSize) / file.size) * 100) : 0;
</script>

<div transition:slide class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex items-center gap-4">
  <div class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
    {#if status === 'processing'}
      <Loader2 class="w-5 h-5 animate-spin text-yellow-400" />
    {:else if status === 'done'}
      <CheckCircle2 class="w-5 h-5 text-green-500" />
    {:else if status === 'error'}
      <AlertCircle class="w-5 h-5 text-red-500" />
    {:else}
      <FileVideo class="w-5 h-5 text-gray-400" />
    {/if}
  </div>

  <div class="flex-1 min-w-0">
    <div class="flex justify-between items-start mb-1">
      <div class="truncate font-medium text-sm pr-2">{file.name}</div>
      <div class="mono text-xs text-gray-500 whitespace-nowrap">{formatBytes(file.size)}</div>
    </div>

    {#if status === 'processing'}
      <div class="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
        <div class="bg-yellow-400 h-1.5 transition-all duration-300" style="width: {progress}%"></div>
      </div>
    {:else if status === 'done' && resultSize}
      <div class="flex items-center gap-2 mt-1">
        <span class="mono text-xs font-bold text-green-600">
          {formatBytes(resultSize)}
        </span>
        {#if savings > 0}
            <span class="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">-{savings}%</span>
        {/if}
      </div>
    {:else if status === 'error'}
      <div class="text-xs text-red-500 mt-1">{t.common.error}</div>
    {/if}
  </div>

  <div class="flex items-center gap-2">
    {#if status === 'done' && resultName}
      <button 
        on:click={() => dispatch('download')}
        class="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition"
        title={t.common.download}
      >
        <Download class="w-4 h-4" />
      </button>
    {/if}
    
    <button 
      on:click={() => dispatch('remove')}
      class="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-gray-400 transition"
      title={t.common.remove}
    >
      <Trash2 class="w-4 h-4" />
    </button>
  </div>
</div>
