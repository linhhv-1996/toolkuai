<!-- +page.svelte -->
<script lang="ts">
    import { page } from "$app/state";
    import { toolUi } from "$lib/data/toolUi";
    import { siteConfig, type SupportedLang } from "$lib/data/siteConfig";
    import {
        Input,
        Output,
        Conversion,
        BlobSource,
        BufferTarget,
        Mp4OutputFormat,
        ALL_FORMATS,
    } from "mediabunny";
    import JSZip from "jszip";
    // Components
    import Dropzone from "$lib/components/tool/Dropzone.svelte";
    import ProcessingState from "$lib/components/tool/ProcessingState.svelte";
    import SuccessState from "$lib/components/tool/SuccessState.svelte";
    import BlogSidebar from "$lib/components/BlogSidebar.svelte";
    import FileListPanel from "$lib/components/tool/FileListPanel.svelte"; // THÊM: Import component mới
    import { ChevronLeft, Plus, Trash2 } from "lucide-svelte"; // Thêm Plus và Trash2 cho icons

    const currentLang = $derived(
        (siteConfig.languages.find(
            (l) => l.path === page.params.lang?.toLowerCase(),
        )?.id || siteConfig.defaultLang) as SupportedLang,
    );
    const t = $derived(toolUi[currentLang]);
    const langPath = $derived(currentLang === siteConfig.defaultLang ? "" : `/${currentLang}`);
    let { data } = $props();
    const MarkdownContent = $derived(data.MarkdownContent);
    // App State
    let videoQueue = $state<any[]>([]);
    let status = $state<"idle" | "selected" | "processing" | "success">("idle");
    let overallProgress = $state(0);
    let zipUrl = $state<string | null>(null);
    let totalSavedBytes = $state(0);
    let processingTime = $state<string>(""); // New: for processing time
    // Options
    let quality = $state("medium");
    let fileInput = $state();
    // Panel state
    let showFilePanel = $state(false);
    // New states for ProcessingState
    let currentFileName = $state("");

    $effect(() => {
        if (videoQueue.length > 0 && status === "idle") {
            status = "selected";
        } else if (videoQueue.length === 0 && status === "selected") {
            status = "idle";
        }
    });

    function handleFiles(files: File[]) {
        const newItems = files.map((f) => ({
            file: f,
            status: "pending",
            progress: 0,
        }));
        videoQueue = [...videoQueue, ...newItems];
    }

    function addMoreFiles() {
        fileInput.click();
    }

    function clearFiles() {
        videoQueue = [];
        // Status sẽ tự về "idle" nhờ $effect
    }

    // Add drop over whole main for add more
    function handleDrop(e: any) {
        e.preventDefault();
        if (status === "selected" && e.dataTransfer?.files) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    }

    async function startCompression() {
        if (videoQueue.length === 0) return;
        status = "processing";
        totalSavedBytes = 0;
        const zip = new JSZip();
        const startTime = Date.now(); // New: Start timing
        try {
            for (let i = 0; i < videoQueue.length; i++) {
                const item = videoQueue[i];
                currentFileName = item.file.name;
                item.status = "processing";
                const input = new Input({
                    source: new BlobSource(item.file),
                    formats: ALL_FORMATS,
                });
                const output = new Output({
                    format: new Mp4OutputFormat(),
                    target: new BufferTarget(),
                });
                const bitrateMap: any = {
                    high: 800000,
                    medium: 1500000,
                    low: 3000000,
                };
                const conv = await Conversion.init({
                    input,
                    output,
                    video: {
                        forceTranscode: true,
                        bitrate: bitrateMap[quality],
                    },
                    audio: { forceTranscode: true, bitrate: 128000 },
                });
                conv.onProgress = (p) => {
                    item.progress = Math.round(p * 100);
                    overallProgress = Math.round(
                        ((i + p) / videoQueue.length) * 100,
                    );
                };
                await conv.execute();
                if (!output.target.buffer) {
                    throw new Error(
                        "Compression failed: Output buffer is null",
                    );
                }
                const result = new Uint8Array(output.target.buffer);
                item.resultSize = result.length;
                totalSavedBytes += item.file.size - result.length;
                zip.file(`toolkuai_${item.file.name}`, result);
                item.status = "done";
            }
            const blob = await zip.generateAsync({ type: "blob" });
            zipUrl = URL.createObjectURL(blob);

            // New: Calculate processing time
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

    function reset() {
        videoQueue = [];
        zipUrl = null;
        status = "idle";
        overallProgress = 0;
        processingTime = ""; // Reset
    }

    // Derived totals
    const totalOriginalBytes = $derived(
        videoQueue.reduce((sum, item) => sum + (item.file?.size || 0), 0)
    );
    const totalSelectedSize = $derived(
        (totalOriginalBytes / 1024 / 1024).toFixed(1)
    );
    const totalCompressedFiles = $derived(videoQueue.length);
    const totalSavedMB = $derived((totalSavedBytes / 1024 / 1024).toFixed(1));
    const savedPercentage = $derived(
        totalOriginalBytes > 0 ? ((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1) : "0"
    );

    // New: customInfo for SuccessState
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
        if (original === 0) return 0;
        return ((original - result) / original * 100).toFixed(1);
    }

    function removeFile(i: number) {
        videoQueue = videoQueue.filter((_, idx) => idx !== i);
    }

    function viewFiles() {
        showFilePanel = true;
    }
</script>

<main class="max-w-[960px] mx-auto px-6 mb-12 mt-10" ondrop={handleDrop} ondragover={(e) => e.preventDefault()}>
    <nav class="mb-4">
        <a
            href="{langPath || '/'}"
            class="inline-flex items-center space-x-1 text-gray-500 hover:text-[#10b981] transition-colors mono text-[11px] uppercase tracking-wider group"
        >
            <ChevronLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t.common.backToTools}</span>
        </a>
    </nav>
    <div class="mb-12">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
            {t.videoCompress.title}
        </h1>
        <p class="text-[15px] text-gray-600 max-w-md mb-6 mx-auto md:mx-0 leading-relaxed">
            {t.videoCompress.subTitle}
        </p>
    </div>
    <div class="flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-[630px] flex-shrink-0">
            <div class="tool-box relative bg-white rounded-sm border border-gray-200 p-6 space-y-6" style="height: 340px; overflow: hidden;">
                {#if status === "idle"}
                    <div class="space-y-6">
                        <Dropzone onFilesSelected={handleFiles} accept="video/*" {t} />
                        <section id="compressionOptions" class="space-y-4">
                            <div class="mono text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                                {t.common.options}
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="mono text-[11px] text-gray-500 uppercase font-bold">{t.videoCompress.quality}</label>
                                <select bind:value={quality} class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white" id="qualityLevel">
                                    <option class="mono text-[13px]" value="high">{t.videoCompress.qualityLevels.high}</option>
                                    <option class="mono text-[13px]" value="medium">{t.videoCompress.qualityLevels.medium}</option>
                                    <option class="mono text-[13px]" value="low">{t.videoCompress.qualityLevels.low}</option>
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
                                You have selected <b>{videoQueue.length} {videoQueue.length === 1 ? t.common.fileSelected : t.common.filesSelected}</b> totaling <b>{totalSelectedSize} MB</b>. 
                                <!-- svelte-ignore a11y_invalid_attribute -->
                                <a href="#" onclick={(e) => { e.preventDefault(); showFilePanel = true; }} class="text-[#10b981] hover:underline font-medium">{t.common.viewDetail}</a>
                            </p>
                        </div>
                        <section id="compressionOptions" class="space-y-4">
                            <div class="mono text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                                {t.common.options}
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="mono text-[11px] text-gray-500 uppercase font-bold">{t.videoCompress.quality}</label>
                                <select bind:value={quality} class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white" id="qualityLevel">
                                    <option class="mono text-[13px]" value="high">{t.videoCompress.qualityLevels.high}</option>
                                    <option class="mono text-[13px]" value="medium">{t.videoCompress.qualityLevels.medium}</option>
                                    <option class="mono text-[13px]" value="low">{t.videoCompress.qualityLevels.low}</option>
                                </select>
                            </div>
                        </section>
                        <input type="file" accept="video/*" multiple bind:this={fileInput} class="hidden" onchange={(e) => handleFiles(Array.from(e.target.files || []))} />
                        <button onclick={startCompression} disabled={videoQueue.length === 0} class="w-full bg-[#10b981] text-white mono text-[13px] py-3 rounded-sm hover:bg-green-700 transition disabled:opacity-50 font-bold uppercase tracking-wider">
                            {t.videoCompress.start}
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
                        {videoQueue} 
                        {status} 
                        {t} 
                        onClose={() => showFilePanel = false} 
                        onRemove={removeFile} 
                        {formatBytes} 
                        {getSavedPercentage} 
                    />
                {/if}
            </div>

            <article
    class="blog-content border-t border-gray-100 pt-10 mt-16"
>
    {#if MarkdownContent}
        <MarkdownContent />
    {/if}
</article>
        </div>
        <BlogSidebar lang={currentLang} />
    </div>
</main>
