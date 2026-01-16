<!-- PdfCompressor.svelte -->
<script lang="ts">
    import { page } from "$app/state"; // Adjust if not SvelteKit
    import { toolUi } from "$lib/data/toolUi";
    import { siteConfig, type SupportedLang } from "$lib/data/siteConfig";
    import { compress, CompressionError, type CompressionPreset } from "@quicktoolsone/pdf-compress";
    import JSZip from "jszip";
    // Components
    import Dropzone from "$lib/components/tool/Dropzone.svelte";
    import ProcessingState from "$lib/components/tool/ProcessingState.svelte";
    import SuccessState from "$lib/components/tool/SuccessState.svelte";
    import FileListPanel from "$lib/components/tool/FileListPanel.svelte";
    import { Plus, Trash2 } from "lucide-svelte";
    import { onMount } from "svelte";
    import * as pdfjs from "pdfjs-dist";

    onMount(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.js/pdf.worker.min.mjs'; // Theo docs: Copy file vào public/pdf.js/pdf.worker.min.mjs
    });

    const currentLang = $derived(
        (siteConfig.languages.find(
            (l) => l.path === page.params.lang?.toLowerCase(),
        )?.id || siteConfig.defaultLang) as SupportedLang,
    );
    const t = $derived(toolUi[currentLang]);

    // App State
    let pdfQueue = $state<any[]>([]);
    let status = $state<"idle" | "selected" | "processing" | "success">("idle");
    let overallProgress = $state(0);
    let zipUrl = $state<string | null>(null);
    let totalSavedBytes = $state(0);
    let processingTime = $state<string>("");
    // Options
    let quality = $state("medium");
    let fileInput = $state<HTMLInputElement>();
    // Panel state
    let showFilePanel = $state(false);
    // New states for ProcessingState
    let currentFileName = $state("");

    $effect(() => {
        if (pdfQueue.length > 0 && status === "idle") {
            status = "selected";
        } else if (pdfQueue.length === 0 && status === "selected") {
            status = "idle";
        }
    });

    function handleFiles(files: File[]) {
        const newItems = files.map((f) => ({
            file: f,
            status: "pending",
            progress: 0,
        }));
        pdfQueue = [...pdfQueue, ...newItems];
    }

    function addMoreFiles() {
        fileInput?.click();
    }

    function clearFiles() {
        pdfQueue = [];
    }

    async function startCompression() {
        if (pdfQueue.length === 0) return;
        status = "processing";
        totalSavedBytes = 0;
        const zip = new JSZip();
        const startTime = Date.now();
        try {
            for (let i = 0; i < pdfQueue.length; i++) {
                const item = pdfQueue[i];
                currentFileName = item.file.name;
                item.status = "processing";
                const buffer = await item.file.arrayBuffer();

                let preset = quality === "high" ? "lossless" : quality === "medium" ? "balanced" : "max";
                // Docs recommend lighter preset for large files (50MB+)
                if (item.file.size > 50000000) { // >50MB
                    preset = "balanced"; // Or 'lossless' if balanced fails
                    console.warn(`Large file detected (${item.file.size} bytes), using ${preset} preset.`);
                }

                let compressedBuffer;
                try {
                    compressedBuffer = await compressPdfWithRetry(buffer, preset, i);
                } catch (error) {
                    console.error(`Failed to compress ${item.file.name} after retry:`, error);
                    item.status = "error";
                    continue;
                }

                const result = new Uint8Array(compressedBuffer);
                item.resultSize = result.length;
                totalSavedBytes += item.file.size - result.length;
                zip.file(`compressed_${item.file.name}`, result);
                item.status = "done";
                item.progress = 100;
                overallProgress = Math.round(((i + 1) / pdfQueue.length) * 100);
            }
            const blob = await zip.generateAsync({ type: "blob" });
            zipUrl = URL.createObjectURL(blob);

            const endTime = Date.now();
            const durationMs = endTime - startTime;
            const minutes = Math.floor(durationMs / 60000);
            const seconds = Math.floor((durationMs % 60000) / 1000);
            processingTime = `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;

            status = "success";
        } catch (e) {
            console.error(e);
            status = "selected";
        }
    }

    async function compressPdfWithRetry(buffer: ArrayBuffer, initialPreset: string, index: number) {
        let preset = initialPreset;
        let attempt = 0;
        const maxAttempts = 2; // Retry once with lossless

        while (attempt < maxAttempts) {
            try {
                console.log(`Attempt ${attempt + 1} with preset: ${preset}`);
                const result = await compress(buffer, {
                    preset: preset as CompressionPreset,
                    preserveMetadata: true,
                    onProgress: (event) => {
                        pdfQueue[index].progress = event.progress;
                        if (event.message) {
                            currentFileName = `${pdfQueue[index].file.name} - ${event.message}`;
                        }
                        // Update overall progress based on current file and completed files
                        const completedProgress = (index / pdfQueue.length) * 100;
                        const currentFileProgress = (event.progress / 100) * (100 / pdfQueue.length);
                        overallProgress = completedProgress + currentFileProgress;
                        console.log(`${event.phase}: ${event.progress}% ${event.message || ''}`);
                    }
                });
                return result.pdf;
            } catch (error) {
                if (error instanceof CompressionError && error.phase === 'compressing' && (preset === 'balanced' || preset === 'max')) {
                    console.warn('Compression failed in compressing phase, retrying with lossless...');
                    preset = 'lossless';
                    attempt++;
                } else {
                    throw error;
                }
            }
        }
        throw new Error('Compression failed after retries');
    }

    function reset() {
        pdfQueue = [];
        zipUrl = null;
        status = "idle";
        overallProgress = 0;
        processingTime = "";
    }

    // Derived totals
    const totalOriginalBytes = $derived(
        pdfQueue.reduce((sum, item) => sum + (item.file?.size || 0), 0)
    );
    const totalSelectedSize = $derived(
        (totalOriginalBytes / 1024 / 1024).toFixed(1)
    );
    const totalSavedMB = $derived((totalSavedBytes / 1024 / 1024).toFixed(1));
    const savedPercentage = $derived(
        totalOriginalBytes > 0 ? ((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1) : "0"
    );

    const customInfo = $derived(
        `Saved <span class="font-bold">${savedPercentage}%</span> (${totalSavedMB} MB)`
    );

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + ["B", "KB", "MB", "GB"][i];
    }

    function getSavedPercentage(original: number, result: number) {
        if (original === 0) return "0";
        return ((original - result) / original * 100).toFixed(1);
    }

    function removeFile(i: number) {
        pdfQueue = pdfQueue.filter((_, idx) => idx !== i);
    }

    function viewFiles() {
        showFilePanel = true;
    }
</script>

<div class="w-full">
    <div class="tool-box relative bg-white rounded-sm border border-gray-200 p-6 space-y-6" 
         style="height: 340px; overflow: hidden; box-sizing: border-box; width: 100%;">
        {#if status === "idle"}
            <div class="space-y-6">
                <Dropzone onFilesSelected={handleFiles} accept="application/pdf" {t} />
                <section id="compressionOptions" class="space-y-4">
                    <div class="mono text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                        {t.common.options}
                    </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="mono text-[11px] text-gray-500 uppercase font-bold">Quality</label>
                        <select bind:value={quality} class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white" id="qualityLevel">
                            <option class="mono text-[13px]" value="high">High (Lossless)</option>
                            <option class="mono text-[13px]" value="medium">Balanced</option>
                            <option class="mono text-[13px]" value="low">Low (Max)</option>
                        </select>
                    </div>
                </section>
            </div>
        {:else if status === "selected"}
            <div class="space-y-6">
                <div class="space-y-2">
                    <div class="flex flex-col gap-2 mb-6">
                        <div class="mono text-[11px] text-gray-500 uppercase tracking-widest font-bold">
                            {t.common.selectedFiles}
                        </div>
                        <div class="flex space-x-2">
                            <button onclick={addMoreFiles} class="flex items-center border border-[#10b981] text-[#10b981] mono text-[11px] px-3 py-1 rounded-sm hover:bg-green-50 transition font-bold uppercase tracking-wider">
                                <Plus class="w-4 h-4 mr-1" /> Add more
                            </button>
                            <button onclick={clearFiles} class="flex items-center border border-gray-300 text-gray-600 mono text-[11px] px-3 py-1 rounded-sm hover:bg-gray-50 transition font-bold uppercase tracking-wider">
                                <Trash2 class="w-4 h-4 mr-1" /> Clear
                            </button>
                        </div>
                    </div>
                    <p class="text-sm text-gray-800">
                        You have selected <b>{pdfQueue.length} {pdfQueue.length === 1 ? t.common.fileSelected : t.common.filesSelected}</b> totaling <b>{totalSelectedSize} MB</b>. 
                        <!-- svelte-ignore a11y_invalid_attribute -->
                        <a href="#" onclick={(e) => { e.preventDefault(); showFilePanel = true; }} class="text-[#10b981] hover:underline font-medium">{t.common.viewDetail}</a>
                    </p>
                </div>
                <section id="compressionOptions" class="space-y-4">
                    <div class="mono text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                        {t.common.options}
                    </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="mono text-[11px] text-gray-500 uppercase font-bold">Quality</label>
                        <select bind:value={quality} class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white" id="qualityLevel">
                            <option class="mono text-[13px]" value="high">High (Lossless)</option>
                            <option class="mono text-[13px]" value="medium">Balanced</option>
                            <option class="mono text-[13px]" value="low">Low (Max)</option>
                        </select>
                    </div>
                </section>
                 <input 
                    type="file" 
                    accept="application/pdf" 
                    multiple 
                    bind:this={fileInput} 
                    class="hidden" 
                    onchange={(e) => handleFiles(Array.from(e.currentTarget.files || []))} 
                />
                <button onclick={startCompression} disabled={pdfQueue.length === 0} class="w-full bg-[#10b981] text-white mono text-[13px] py-3 rounded-sm hover:bg-green-700 transition disabled:opacity-50 font-bold uppercase tracking-wider">
                    Start
                </button>
            </div>
        {:else if status === "processing"}
            <div class="space-y-6">
                <div class="space-y-2">
                    <div class="mono text-[11px] text-gray-500 uppercase tracking-widest font-bold">
                        {t.common.processing}
                    </div>
                </div>
                <ProcessingState 
                    progress={overallProgress} 
                    {t} 
                    currentFileName={currentFileName}
                />
            </div>
        {:else if status === "success"}
            <SuccessState 
                {processingTime} 
                {customInfo} 
                {zipUrl} 
                onReset={reset} 
                {t} 
                onViewFiles={viewFiles} 
            />
        {/if}

        {#if showFilePanel}
            <FileListPanel 
                videoQueue={pdfQueue} 
                {status} 
                {t} 
                onClose={() => showFilePanel = false} 
                onRemove={removeFile} 
                {formatBytes} 
                {getSavedPercentage} 
            />
        {/if}
    </div>
</div>
