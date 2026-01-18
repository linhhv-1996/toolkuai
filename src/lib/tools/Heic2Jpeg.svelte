<!-- HeicConverter.svelte -->
<script lang="ts">
    import { page } from "$app/state";
    import { toolUi } from "$lib/data/toolUi";
    import { siteConfig, type SupportedLang } from "$lib/data/siteConfig";
    import JSZip from "jszip";
    import { heicTo } from "heic-to";
    // Components
    import Dropzone from "$lib/components/tool/Dropzone.svelte";
    import ProcessingState from "$lib/components/tool/ProcessingState.svelte";
    import SuccessState from "$lib/components/tool/SuccessState.svelte";
    import FileListPanel from "$lib/components/tool/FileListPanel.svelte";
    import { Plus, Trash2 } from "lucide-svelte";

    const currentLang = $derived(
        (siteConfig.languages.find(
            (l) => l.path === page.params.lang?.toLowerCase(),
        )?.id || siteConfig.defaultLang) as SupportedLang,
    );
    const t = $derived(toolUi[currentLang]);

    // App State
    let heicQueue = $state<any[]>([]);
    let status = $state<"idle" | "selected" | "processing" | "success">("idle");
    let zipUrl = $state<string | null>(null);
    let totalSavedBytes = $state(0);
    let processingTime = $state<string>("");
    // Options
    let outputFormat = $state("png");
    let quality = $state(80); // Default quality (0-100)
    let fileInput = $state<HTMLInputElement>();
    // Panel state
    let showFilePanel = $state(false);
    // New states for ProcessingState
    let currentFileName = $state("");

    $effect(() => {
        if (heicQueue.length > 0 && status === "idle") {
            status = "selected";
        } else if (heicQueue.length === 0 && status === "selected") {
            status = "idle";
        }
    });

    function handleFiles(files: File[]) {
        const newItems = files.map((f) => ({
            file: f,
            status: "pending",
            progress: 0,
        }));
        heicQueue = [...heicQueue, ...newItems];
    }

    function addMoreFiles() {
        fileInput?.click();
    }

    function clearFiles() {
        heicQueue = [];
    }

    // Add drop over whole main for add more

    async function startConversion() {
        if (heicQueue.length === 0) return;
        status = "processing";
        totalSavedBytes = 0;
        const zip = new JSZip();
        const startTime = Date.now();
        try {
            for (let i = 0; i < heicQueue.length; i++) {
                const item = heicQueue[i];
                currentFileName = item.file.name;
                item.status = "processing";
                item.progress = 0;

                // Simulate smooth progress animation
                const animationInterval = setInterval(() => {
                    if (item.progress < 95) {
                        item.progress += 1; // Increment by 1% for smoother animation
                    } else {
                        clearInterval(animationInterval);
                    }
                }, 50); // Update every 50ms for smoothness

                // Convert HEIC to Blob
                const convertedBlob = await heicTo({
                    blob: item.file,
                    type: outputFormat === "jpg" ? "image/jpeg" : "image/png",
                    quality: quality / 100,
                });

                // Stop animation and set to 100%
                clearInterval(animationInterval);
                item.progress = 100;

                const outputFileName = item.file.name.replace(
                    /\.[^/.]+$/,
                    `.${outputFormat}`,
                );

                item.resultSize = convertedBlob.size;
                item.resultBlob = convertedBlob; // Lưu Blob để download lẻ
                item.resultName = outputFileName; // Lưu tên mới để hiển thị Panel

                const arrayBuffer = await convertedBlob.arrayBuffer();
                const result = new Uint8Array(arrayBuffer);
                item.resultSize = result.length;
                totalSavedBytes += item.file.size - result.length;

                zip.file(`toolkuai_${outputFileName}`, result);
                item.status = "done";
            }
            const blob = await zip.generateAsync({ type: "blob" });
            zipUrl = URL.createObjectURL(blob);

            // Calculate processing time
            const endTime = Date.now();
            const durationMs = endTime - startTime;
            const minutes = Math.floor(durationMs / 60000);
            const seconds = Math.floor((durationMs % 60000) / 1000);
            
            processingTime = t.common.timeResult
            .replace('{m}', minutes.toString())
            .replace('{mUnit}', minutes !== 1 ? t.common.minutes : t.common.minute)
            .replace('{s}', seconds.toString())
            .replace('{sUnit}', seconds !== 1 ? t.common.seconds : t.common.second);

            status = "success";
        } catch (e) {
            console.error(e);
            status = "selected";
        }
    }

    function reset() {
        heicQueue = [];
        zipUrl = null;
        status = "idle";
        processingTime = "";
    }

    function downloadSingleFile(item: any) {
        if (!item.resultBlob) return;

        const url = URL.createObjectURL(item.resultBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.resultName || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Derived totals
    const totalOriginalBytes = $derived(
        heicQueue.reduce((sum, item) => sum + (item.file?.size || 0), 0),
    );

    const totalSelectedSize = $derived(formatBytes(totalOriginalBytes));

    // Derived overall progress
    const overallProgress = $derived(
        Math.round(
            heicQueue.reduce((sum, item) => sum + (item.progress || 0), 0) /
                heicQueue.length,
        ),
    );

    // New: customInfo for SuccessState
    const unit = $derived(heicQueue.length > 1 ? t.common.unitFiles : t.common.unitFile);

    // 2. Render câu thông báo từ template trong toolUi
    const customInfo = $derived(
        t.common.convertedTo
            .replace('{count}', heicQueue.length.toString())
            .replace('{unit}', unit)
            .replace('{format}', outputFormat.toUpperCase())
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

    function getReducedPercentage(original: number, result: number) {
        if (original === 0) return "0";
        return (((original - result) / original) * 100).toFixed(1);
    }

    function removeFile(i: number) {
        heicQueue = heicQueue.filter((_, idx) => idx !== i);
    }

    function viewFiles() {
        showFilePanel = true;
    }
</script>

<div class="w-full">
    <div
        class="tool-box relative bg-white rounded-sm border border-gray-200 p-4 space-y-6"
        style="height: 413px; overflow: hidden; box-sizing: border-box; width: 100%;"
    >
        {#if status === "idle"}
            <div class="space-y-6">
                <Dropzone
                    onFilesSelected={handleFiles}
                    accept=".heic,.HEIC"
                    {t}
                />
                <section id="conversionOptions" class="space-y-4">
                    <div
                        class="mono text-[12px] text-slate-500 mb-1.5 uppercase tracking-wider font-semibold"
                    >
                        {t.common.options}
                    </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label
                            class="mono text-[12px] text-gray-500 uppercase tracking-wider font-semibold"
                            >{t.common.format}</label
                        >
                        <select
                            bind:value={outputFormat}
                            class="mono text-[14px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white"
                            id="outputFormat"
                        >
                            <option class="mono text-[14px]" value="png"
                                >PNG</option
                            >
                            <option class="mono text-[14px]" value="jpg"
                                >JPG</option
                            >
                        </select>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label
                            class="mono text-[12px] text-gray-500 uppercase tracking-wider font-semibold"
                            >{t.common.quality}</label
                        >
                        <input
                            type="range"
                            bind:value={quality}
                            min="10"
                            max="100"
                            step="10"
                            class="w-full accent-red-600"
                        />
                        <span class="text-sm text-gray-600">{quality}%</span>
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
                                class="mono text-[12px] text-gray-500 uppercase tracking-widest font-bold"
                            >
                                {t.common.selectedFiles}
                            </div>
                            <div class="flex space-x-2">
                                <button
                                    onclick={addMoreFiles}
                                    class="flex items-center border border-[#10b981] text-[#10b981] mono text-[12px] px-3 py-1 rounded-sm hover:bg-green-50 transition font-bold uppercase tracking-wider"
                                >
                                    <Plus class="w-4 h-4 mr-1" />{t.common
                                        .addMore}
                                </button>
                                <button
                                    onclick={clearFiles}
                                    class="flex items-center border border-gray-300 text-gray-600 mono text-[12px] px-3 py-1 rounded-sm hover:bg-gray-50 transition font-bold uppercase tracking-wider"
                                >
                                    <Trash2 class="w-4 h-4 mr-1" />{t.common
                                        .clear}
                                </button>
                            </div>
                        </div>
                        <p class="text-sm text-gray-800 leading-relaxed">
                            {t.common.youHaveSelected}
                            <b
                                >{heicQueue.length}
                                {heicQueue.length === 1
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

                    <section id="conversionOptions" class="space-y-4">
                        <div
                            class="mono text-[12px] text-slate-500 mb-1.5 uppercase tracking-wider font-semibold"
                        >
                            {t.common.options}
                        </div>
                        <div class="flex flex-col space-y-2">
                            <label
                                class="mono text-[12px] text-gray-500 uppercase tracking-wider font-semibold"
                                >{t.common.format}</label
                            >
                            <select
                                bind:value={outputFormat}
                                class="mono text-[14px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white"
                                id="outputFormat"
                            >
                                <option class="mono text-[14px]" value="png"
                                    >PNG</option
                                >
                                <option class="mono text-[14px]" value="jpg"
                                    >JPG</option
                                >
                            </select>
                        </div>
                        <div class="flex flex-col space-y-2">
                            <label
                                class="mono text-[12px] text-gray-500 uppercase tracking-wider font-semibold"
                                >{t.common.quality}</label
                            >
                            <input
                                type="range"
                                bind:value={quality}
                                min="10"
                                max="100"
                                step="10"
                                class="w-full accent-red-600"
                            />
                            <span class="text-sm text-gray-600">{quality}%</span
                            >
                        </div>
                    </section>
                </div>

                <div
                    class="flex-shrink-0 pt-4 pb-1 bg-white border-t border-gray-50"
                >
                    <input
                        type="file"
                        accept=".heic,.HEIC,.heif,.HEIF"
                        multiple
                        bind:this={fileInput}
                        class="hidden"
                        onchange={(e) =>
                            handleFiles(
                                Array.from(e.currentTarget.files || []),
                            )}
                    />
                    <button
                        onclick={startConversion}
                        disabled={heicQueue.length === 0}
                        class="w-full bg-[#10b981] text-white mono text-[13px] py-3 rounded-sm hover:bg-green-700 transition disabled:opacity-50 font-bold uppercase tracking-wider"
                    >
                        {t.heic2jpg.startConvert}
                    </button>
                </div>
            </div>
        {:else if status === "processing"}
            <div class="space-y-6 h-full">
                <!-- <div class="space-y-2">
                    <div
                        class="mono text-[12px] text-gray-500 uppercase tracking-widest font-bold"
                    >
                        {t.common.processing}
                    </div>
                </div> -->
                <ProcessingState
                    progress={overallProgress}
                    currentIndex={heicQueue.findIndex(
                        (item) => item.status === "processing",
                    ) + 1}
                    totalFiles={heicQueue.length}
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
                headerPy={"py-12"}
            />
        {/if}

        {#if showFilePanel}
            <FileListPanel
                fileQueue={heicQueue}
                {status}
                {t}
                onClose={() => (showFilePanel = false)}
                onRemove={removeFile}
                {formatBytes}
                getSavedPercentage={getReducedPercentage}
                onDownload={downloadSingleFile}
                isCompressor={false}
            />
        {/if}
    </div>
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
