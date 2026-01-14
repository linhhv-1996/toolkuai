<script lang="ts">
  import { 
    Input, Output, Conversion, BlobSource, BufferTarget, 
    Mp4OutputFormat, ALL_FORMATS 
  } from 'mediabunny';
  import JSZip from "jszip";
  import { Download, Zap, RefreshCw } from "lucide-svelte";
  import { toolUi } from '$lib/data/toolUi';
  
  // Components
  import Dropzone from '$lib/components/Dropzone.svelte';
  import FileItem from '$lib/components/FileItem.svelte';

  // Props (Svelte 5)
  let { lang = "en" } = $props();

  // Types
  interface VideoFile {
    id: string;
    file: File;
    status: "pending" | "processing" | "done" | "error";
    progress: number;
    resultSize?: number;
    resultName?: string;
    finalData?: Uint8Array;
  }

  // State
  let isProcessing = $state(false);
  let overallProgress = $state(0);
  let errorMsg = $state("");
  let videoQueue = $state<VideoFile[]>([]);
  let qualityLevel = $state(5); // 1-10
  let batchZipUrl = $state<string | null>(null);

  // Derived
  const t = $derived(toolUi[lang] || toolUi.en);
  const totalSavingBytes = $derived(
    videoQueue.reduce((acc, item) => {
      if (item.status === "done" && item.resultSize) {
        const saving = item.file.size - item.resultSize;
        return acc + (saving > 0 ? saving : 0);
      }
      return acc;
    }, 0)
  );

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  // Logic: Compress One File
  async function compressOne(item: VideoFile, index: number) {
    const file = item.file;
    const videoEl = document.createElement('video');
    videoEl.src = URL.createObjectURL(file);
    videoEl.muted = true;
    
    // Wait for metadata
    await new Promise((r) => (videoEl.onloadedmetadata = r));
    
    const duration = videoEl.duration;
    // Calculate bitrate based on quality slider
    const originalBitrate = (file.size * 8) / duration;
    const factor = 0.2 + (qualityLevel - 1) * (0.8 / 9); // Map slider 1-10 to factor 0.2-1.0
    let targetBitrate = Math.round(originalBitrate * factor * 0.9);
    
    // Clamp limits
    targetBitrate = Math.max(500_000, Math.min(targetBitrate, 5_000_000));
    const targetAudioBitrate = Math.round((64 + qualityLevel * 12.8) * 1000);

    const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
    const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() });

    const conversion = await Conversion.init({
      input, output,
      video: { forceTranscode: true, bitrate: targetBitrate, hardwareAcceleration: 'prefer-hardware' },
      audio: { forceTranscode: true, bitrate: targetAudioBitrate }
    });

    conversion.onProgress = (p) => {
      item.progress = Math.round(p * 100);
      // Update overall progress roughly
      overallProgress = Math.round(((index + p) / videoQueue.length) * 100);
    };

    await conversion.execute();
    URL.revokeObjectURL(videoEl.src);
    return output.target.buffer;
  }

  // Logic: Batch Process
  async function startBatchCompression() {
    if (videoQueue.length === 0 || isProcessing) return;
    
    // Reset states
    videoQueue = videoQueue.map(item => ({ ...item, status: "pending", progress: 0 }));
    isProcessing = true;
    errorMsg = "";
    batchZipUrl = null;
    const zip = new JSZip();

    try {
      for (let i = 0; i < videoQueue.length; i++) {
        const item = videoQueue[i];
        item.status = "processing";

        try {
          const buffer = await compressOne(item, i);
          const compressedData = new Uint8Array(buffer);

          // Check if compression actually saved space
          const isBetter = compressedData.length < item.file.size;
          const finalData = isBetter ? compressedData : new Uint8Array(await item.file.arrayBuffer());

          item.resultSize = finalData.length;
          item.finalData = finalData;
          item.resultName = `min_${item.file.name.split(".")[0]}.mp4`;
          item.status = "done";

          zip.file(item.resultName, finalData);
        } catch (e) {
          console.error(e);
          item.status = "error";
        }
      }

      // Generate Zip
      const zipContent = await zip.generateAsync({ type: "blob" });
      batchZipUrl = URL.createObjectURL(zipContent);

    } catch (e) {
      errorMsg = t.common.error;
    } finally {
      isProcessing = false;
      overallProgress = 100;
    }
  }

  function handleFiles(newFiles: File[]) {
    const temp = newFiles.map(f => ({ 
      id: Math.random().toString(36).substring(7),
      file: f, 
      status: "pending", 
      progress: 0 
    } as VideoFile));
    videoQueue = [...videoQueue, ...temp];
    batchZipUrl = null; // Reset zip if new files added
  }

  function removeFile(id: string) {
    videoQueue = videoQueue.filter(x => x.id !== id);
    if (videoQueue.length === 0) {
       batchZipUrl = null;
       overallProgress = 0;
    }
  }

  function downloadFile(item: VideoFile) {
    if (!item.finalData || !item.resultName) return;
    const blob = new Blob([item.finalData], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.resultName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadZip() {
    if (!batchZipUrl) return;
    const a = document.createElement('a');
    a.href = batchZipUrl;
    a.download = "compressed_videos_toolkuai.zip";
    a.click();
  }
</script>

<div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  
  <div class="p-6 border-b border-gray-100">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h2 class="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
        <Zap class="w-5 h-5 text-yellow-400 fill-current" />
        {t.videoCompress.title}
      </h2>
      
      {#if videoQueue.length > 0}
        <button 
          onclick={startBatchCompression} 
          disabled={isProcessing}
          class="bg-black text-white px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {#if isProcessing}
            <RefreshCw class="w-4 h-4 animate-spin" /> {t.common.processing} {overallProgress}%
          {:else}
            {t.videoCompress.start}
          {/if}
        </button>
      {/if}
    </div>

    {#if videoQueue.length > 0}
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex justify-between items-center mb-2">
           <label for="quality" class="text-xs font-bold uppercase tracking-wider text-gray-500">{t.videoCompress.quality}</label>
           <span class="font-mono text-xs font-bold">{qualityLevel}/10</span>
        </div>
        <input 
          id="quality" 
          type="range" 
          min="1" 
          max="10" 
          step="1" 
          bind:value={qualityLevel}
          disabled={isProcessing}
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-400"
        />
        <div class="flex justify-between mt-1 text-[10px] uppercase tracking-widest text-gray-400">
          <span>{t.videoCompress.qualityLow}</span>
          <span>{t.videoCompress.qualityHigh}</span>
        </div>
      </div>
    {/if}
  </div>

  <div class="p-6 space-y-4">
    {#if videoQueue.length === 0}
      <Dropzone 
        title={t.common.dropTitle} 
        description={t.common.dropDesc}
        accept="video/*"
        on:drop={(e) => handleFiles(e.detail)}
      />
    {:else}
      <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {#each videoQueue as item (item.id)}
          <FileItem 
            file={item.file} 
            status={item.status} 
            progress={item.progress}
            resultSize={item.resultSize}
            resultName={item.resultName}
            {t}
            on:remove={() => removeFile(item.id)}
            on:download={() => downloadFile(item)}
          />
        {/each}
      </div>

      <div class="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
        <Dropzone 
          compact 
          title={t.common.addMore} 
          accept="video/*"
          on:drop={(e) => handleFiles(e.detail)}
        />

        {#if batchZipUrl}
          <div class="flex items-center gap-4 bg-green-50 px-4 py-3 rounded-lg border border-green-100 w-full md:w-auto">
             <div class="flex-1">
                <div class="text-xs font-bold uppercase text-green-800">{t.common.success}</div>
                <div class="text-[11px] text-green-600 mt-0.5">
                   {t.videoCompress.saving}: <b>{formatBytes(totalSavingBytes)}</b>
                </div>
             </div>
             <button 
               onclick={downloadZip}
               class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-xs font-bold uppercase hover:bg-green-700 transition shadow-sm"
             >
                <Download class="w-4 h-4" /> {t.common.downloadAll}
             </button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
