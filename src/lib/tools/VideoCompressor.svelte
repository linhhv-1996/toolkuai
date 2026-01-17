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
    import FileListPanel from "$lib/components/tool/FileListPanel.svelte"; // THÊM: Import component mới
    import { Plus, Trash2 } from "lucide-svelte"; // Thêm Plus và Trash2 cho icons

    const currentLang = $derived(
        (siteConfig.languages.find(
            (l) => l.path === page.params.lang?.toLowerCase(),
        )?.id || siteConfig.defaultLang) as SupportedLang,
    );
    const t = $derived(toolUi[currentLang]);

    // App State
    let videoQueue = $state<any[]>([]);
    let status = $state<"idle" | "selected" | "processing" | "success">("idle");
    let overallProgress = $state(0);
    let zipUrl = $state<string | null>(null);
    let totalSavedBytes = $state(0);
    let processingTime = $state<string>(""); // New: for processing time
    // Options
    let quality = $state("medium");
    let fileInput = $state<HTMLInputElement>();
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
        fileInput?.click();
    }

    function clearFiles() {
        videoQueue = [];
        // Status sẽ tự về "idle" nhờ $effect
    }

    // Add drop over whole main for add more

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
                item.resultName = `compressed_${item.file.name}`; // Tên file khi tải lẻ
                item.resultBlob = new Blob([result], { type: "video/mp4" });

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
            processingTime = `${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds} second${seconds !== 1 ? "s" : ""}`;

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

    function downloadSingleFile(item: any) {
        if (!item.resultBlob) return;

        const url = URL.createObjectURL(item.resultBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.resultName || `compressed_${item.file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Derived totals
    const totalOriginalBytes = $derived(
        videoQueue.reduce((sum, item) => sum + (item.file?.size || 0), 0),
    );
    
    const totalSelectedSize = $derived(formatBytes(totalOriginalBytes));

    const totalSavedMB = $derived((totalSavedBytes / 1024 / 1024).toFixed(1));
    const savedPercentage = $derived(
        totalOriginalBytes > 0
            ? ((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1)
            : "0",
    );

    // New: customInfo for SuccessState
    const customInfo = $derived(
        `Saved <span class="font-bold">${savedPercentage}%</span> (${totalSavedMB} MB)`,
    );

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(1)) +
            " " +
            ["B", "KB", "MB", "GB"][i]
        );
    }

    function getSavedPercentage(original: number, result: number) {
        if (original === 0) return "0";
        return (((original - result) / original) * 100).toFixed(1);
    }

    function removeFile(i: number) {
        videoQueue = videoQueue.filter((_, idx) => idx !== i);
    }

    function viewFiles() {
        showFilePanel = true;
    }
</script>

<div class="w-full">
    <div
        class="tool-box relative bg-white rounded-sm border border-gray-200 p-4 space-y-6"
        style="height: 328px; overflow: hidden; box-sizing: border-box; width: 100%;"
    >
        {#if status === "idle"}
            <div class="space-y-6">
                <Dropzone onFilesSelected={handleFiles} accept="video/*" {t} />
                <section id="compressionOptions" class="space-y-4">
                    <div
                        class="mono text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold"
                    >
                        {t.common.options}
                    </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label
                            class="mono text-[11px] text-gray-500 uppercase font-bold"
                            >{t.videoCompress.quality}</label
                        >
                        <select
                            bind:value={quality}
                            class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white"
                            id="qualityLevel"
                        >
                            <option class="mono text-[13px]" value="high"
                                >{t.videoCompress.qualityLevels.high}</option
                            >
                            <option class="mono text-[13px]" value="medium"
                                >{t.videoCompress.qualityLevels.medium}</option
                            >
                            <option class="mono text-[13px]" value="low"
                                >{t.videoCompress.qualityLevels.low}</option
                            >
                        </select>
                    </div>
                </section>
            </div>
        {:else if status === "selected"}
            <div class="flex flex-col h-full w-full overflow-hidden">
                <div
                    class="flex-grow overflow-y-auto min-h-0 space-y-6 scrollbar-hide"
                >
                    <div class="space-y-2">
                        <div class="flex flex-col gap-2 mb-4">
                            <div
                                class="mono text-[11px] text-gray-500 uppercase tracking-widest font-bold"
                            >
                                {t.common.selectedFiles}
                            </div>
                            <div class="flex space-x-2">
                                <button
                                    onclick={addMoreFiles}
                                    class="flex items-center border border-[#10b981] text-[#10b981] mono text-[11px] px-3 py-1 rounded-sm hover:bg-green-50 transition font-bold uppercase tracking-wider"
                                >
                                    <Plus class="w-4 h-4 mr-1" />{t.common
                                        .addMore}
                                </button>
                                <button
                                    onclick={clearFiles}
                                    class="flex items-center border border-gray-300 text-gray-600 mono text-[11px] px-3 py-1 rounded-sm hover:bg-gray-50 transition font-bold uppercase tracking-wider"
                                >
                                    <Trash2 class="w-4 h-4 mr-1" />{t.common
                                        .clear}
                                </button>
                            </div>
                        </div>
                        <p class="text-sm text-gray-800 leading-relaxed">
                            {t.common.youHaveSelected}
                            <b
                                >{videoQueue.length}
                                {videoQueue.length === 1
                                    ? t.common.fileSelected
                                    : t.common.filesSelected}</b
                            >
                            {t.common.totaling} <b>{totalSelectedSize}</b>.
                            <a
                                href="#"
                                onclick={(e) => {
                                    e.preventDefault();
                                    showFilePanel = true;
                                }}
                                class="text-[#10b981] hover:underline font-medium"
                                >{t.common.viewDetail}</a
                            >
                        </p>
                    </div>

                    <section id="compressionOptions" class="space-y-3">
                        <div
                            class="mono text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold"
                        >
                            {t.common.options}
                        </div>
                        <div class="flex flex-col space-y-2">
                            <label
                                class="mono text-[11px] text-gray-500 uppercase font-bold"
                                >{t.videoCompress.quality}</label
                            >
                            <select
                                bind:value={quality}
                                class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white"
                                id="qualityLevel"
                            >
                                <option class="mono text-[13px]" value="high"
                                    >{t.videoCompress.qualityLevels
                                        .high}</option
                                >
                                <option class="mono text-[13px]" value="medium"
                                    >{t.videoCompress.qualityLevels
                                        .medium}</option
                                >
                                <option class="mono text-[13px]" value="low"
                                    >{t.videoCompress.qualityLevels.low}</option
                                >
                            </select>
                        </div>
                    </section>
                </div>

                <div
                    class="flex-shrink-0 pt-4 pb-1 bg-white border-t border-gray-50"
                >
                    <input
                        type="file"
                        accept="video/*"
                        multiple
                        bind:this={fileInput}
                        class="hidden"
                        onchange={(e) =>
                            handleFiles(
                                Array.from(e.currentTarget.files || []),
                            )}
                    />
                    <button
                        onclick={startCompression}
                        disabled={videoQueue.length === 0}
                        class="w-full bg-[#10b981] text-white mono text-[13px] py-3 rounded-sm hover:bg-green-700 transition disabled:opacity-50 font-bold uppercase tracking-wider"
                    >
                        {t.videoCompress.start}
                    </button>
                </div>
            </div>
        {:else if status === "processing"}
            <div class="space-y-6 h-full">
                <!-- <div class="space-y-2">
                    <div
                        class="mono text-[11px] text-gray-500 uppercase tracking-widest font-bold"
                    >
                        {t.common.processing}
                    </div>
                </div> -->
                <ProcessingState
                    progress={overallProgress}
                    currentIndex={videoQueue.findIndex(
                        (item) => item.status === "processing",
                    ) + 1}
                    totalFiles={videoQueue.length}
                    {t}
                    {currentFileName}
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
                fileQueue={videoQueue}
                {status}
                {t}
                onClose={() => (showFilePanel = false)}
                onRemove={removeFile}
                {formatBytes}
                {getSavedPercentage}
                onDownload={downloadSingleFile}
                isCompressor={true}
            />
        {/if}
    </div>
</div>

<style>
    /* Ẩn thanh cuộn nhưng vẫn cho phép cuộn nội dung */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
