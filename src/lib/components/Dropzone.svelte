<script lang="ts">
  import { UploadCloud } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  export let title = "Drop files here";
  export let description = "or click to browse";
  export let accept = "*";
  export let multiple = true;
  export let compact = false;

  const dispatch = createEventDispatcher();
  let input: HTMLInputElement;
  let isDragging = false;

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    dispatch("drop", Array.from(files));
    if (input) input.value = "";
  }

  function onDrop(e: DragEvent) {
    isDragging = false;
    handleFiles(e.dataTransfer?.files || null);
  }
</script>

<div
  role="button"
  tabindex="0"
  class="relative border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out cursor-pointer group
  {isDragging ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
  {compact ? 'p-4' : 'p-10'}"
  on:dragover|preventDefault={() => (isDragging = true)}
  on:dragleave={() => (isDragging = false)}
  on:drop|preventDefault={onDrop}
  on:click={() => input.click()}
  on:keydown={(e) => e.key === 'Enter' && input.click()}
>
  <input
    bind:this={input}
    type="file"
    {accept}
    {multiple}
    class="hidden"
    on:change={(e) => handleFiles(e.currentTarget.files)}
  />

  <div class="flex flex-col items-center justify-center text-center">
    <UploadCloud class="{compact ? 'w-8 h-8' : 'w-12 h-12'} text-gray-400 group-hover:text-black mb-3 transition-colors" />
    <p class="font-bold uppercase tracking-wide text-sm">{title}</p>
    {#if !compact}
      <p class="mono text-xs text-gray-500 mt-2">{description}</p>
    {/if}
  </div>
</div>
