<!-- ImageCompressor.svelte -->
<script lang="ts">
    import { page } from "$app/state";
    import { toolUi } from "$lib/data/toolUi";
    import { siteConfig, type SupportedLang } from "$lib/data/siteConfig";
    import JSZip from "jszip";
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
    let imageQueue = $state<any[]>([]);
    let status = $state<"idle" | "selected" | "processing" | "success">("idle");
    let zipUrl = $state<string | null>(null);
    let totalSavedBytes = $state(0);
    let processingTime = $state<string>("");
    // Options
    let outputFormat = $state("original"); // Default to keep original
    let quality = $state(80); // Default quality (0-100)
    let maxWidthOrHeight = $state(0); // Default to 0 (no resize)
    let fileInput = $state<HTMLInputElement>();
    // Panel state
    let showFilePanel = $state(false);
    // New states for ProcessingState
    let currentFileName = $state("");

    $effect(() => {
        if (imageQueue.length > 0 && status === "idle") {
            status = "selected";
        } else if (imageQueue.length === 0 && status === "selected") {
            status = "idle";
        }
    });

    function handleFiles(files: File[]) {
        const newItems = files.map((f) => ({
            file: f,
            status: "pending",
            progress: 0,
        }));
        imageQueue = [...imageQueue, ...newItems];
    }

    function addMoreFiles() {
        fileInput?.click();
    }

    function clearFiles() {
        imageQueue = [];
    }

    function animateProgress(item: any, target: number = 55, factor: number = 0.1): () => void {
        let animationId: number | null = null;

        function step() {
            if (item.progress < target) {
                const remaining = target - item.progress;
                item.progress += remaining * factor;
                if (item.progress > target) item.progress = target;
                animationId = requestAnimationFrame(step);
            }
        }

        animationId = requestAnimationFrame(step);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }

    async function finalAnimate(item: any, startProgress: number, duration: number = 1500): Promise<void> {
        return new Promise((resolve) => {
            let startTime: number | null = null;
            let animationId: number | null = null;

            function step(timestamp: number) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progressFraction = Math.min(elapsed / duration, 1);
                item.progress = startProgress + (100 - startProgress) * progressFraction;

                if (elapsed < duration) {
                    animationId = requestAnimationFrame(step);
                } else {
                    item.progress = 100;
                    resolve();
                }
            }

            animationId = requestAnimationFrame(step);
        });
    }

    async function startCompression() {
        if (imageQueue.length === 0) return;
        status = "processing";
        totalSavedBytes = 0;
        const zip = new JSZip();
        const startTime = Date.now();
        const worker = new Worker(new URL('./compressorWorker.ts', import.meta.url), { type: 'module' });
        let currentIndex = 0;
        let stopAnimation: (() => void) | null = null;

        worker.onmessage = async (e) => {
            const { index, compressedBuffer, effectiveFormat, resultSize, error } = e.data;
            if (error) {
                console.error(error);
                status = "selected";
                if (stopAnimation) stopAnimation();
                worker.terminate();
                return;
            }
            const item = imageQueue[index];

            if (stopAnimation) {
                stopAnimation();
                stopAnimation = null;
            }

            const currentProgress = item.progress;
            const startProgress = Math.max(currentProgress, 56);
            item.progress = startProgress;

            // Delay and animate from startProgress to 100 over 1.5 seconds
            await finalAnimate(item, startProgress, 1500);

            item.resultSize = resultSize;
            totalSavedBytes += item.file.size - resultSize;

            const outputFileName = item.file.name.replace(/\.[^/.]+$/, `.${effectiveFormat}`);
            zip.file(`toolkuai_${outputFileName}`, new Uint8Array(compressedBuffer));
            item.status = "done";

            currentIndex++;
            if (currentIndex < imageQueue.length) {
                processNextFile(currentIndex);
            } else {
                const blob = await zip.generateAsync({ type: "blob" });
                zipUrl = URL.createObjectURL(blob);

                const endTime = Date.now();
                const durationMs = endTime - startTime;
                const minutes = Math.floor(durationMs / 60000);
                const seconds = Math.floor((durationMs % 60000) / 1000);
                processingTime = `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;

                status = "success";
                worker.terminate();
            }
        };

        worker.onerror = (e) => {
            console.error(e);
            status = "selected";
            if (stopAnimation) stopAnimation();
            worker.terminate();
        };

        function processNextFile(index: number) {
            const item = imageQueue[index];
            currentFileName = item.file.name;
            item.status = "processing";
            item.progress = 0;

            // Fast to 55% with factor 0.1 (fast)
            stopAnimation = animateProgress(item, 55, 0.1);

            // After reaching 55, slow down with smaller factor
            setTimeout(() => {
                if (stopAnimation) stopAnimation();
                stopAnimation = animateProgress(item, 99, 0.01); // Very slow after 55
            }, 100); // Small delay to ensure phase switch

            worker.postMessage({
                file: item.file,
                outputFormat,
                quality,
                maxWidthOrHeight,
                index
            });
        }

        processNextFile(0);
    }

    function reset() {
        imageQueue = [];
        zipUrl = null;
        status = "idle";
        processingTime = "";
    }

    // Derived totals
    const totalOriginalBytes = $derived(
        imageQueue.reduce((sum, item) => sum + (item.file?.size || 0), 0)
    );
    const totalSelectedSize = $derived(
        (totalOriginalBytes / 1024 / 1024).toFixed(1)
    );

    // Derived overall progress
    const overallProgress = $derived(
        Math.round(imageQueue.reduce((sum, item) => sum + (item.progress || 0), 0) / imageQueue.length)
    );

    // New: customInfo for SuccessState
    let suffix = $derived(imageQueue.length > 1 ? "files" : "file");

    const customInfo = $derived(
        `Compressed <b>${imageQueue.length} ${suffix}</b> to <span class="font-bold">${outputFormat.toUpperCase() === 'ORIGINAL' ? 'Original Format' : outputFormat.toUpperCase()}</span>`
    );

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + ["B", "KB", "MB", "GB"][i];
    }

    function getReducedPercentage(original: number, result: number) {
        if (original === 0) return "0";
        return ((original - result) / original * 100).toFixed(1);
    }

    function removeFile(i: number) {
        imageQueue = imageQueue.filter((_, idx) => idx !== i);
    }

    function viewFiles() {
        showFilePanel = true;
    }
</script>

<div class="w-full">
    <div class="tool-box relative bg-white rounded-sm border border-gray-200 p-6 space-y-6" 
         style="height: 510px; overflow: hidden; box-sizing: border-box; width: 100%;">
        {#if status === "idle"}
            <div class="space-y-6">
                <Dropzone onFilesSelected={handleFiles} accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff" {t} />
                
                <section id="compressionOptions" class="space-y-4">
                    <div class="mono text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                        {t.common.options}
                    </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="mono text-[11px] text-gray-500 uppercase font-bold">{t.common.format}</label>
                        <select bind:value={outputFormat} class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white" id="outputFormat">
                            <option class="mono text-[13px]" value="original">{t.imageCompressor.keepOriginal}</option>
                            <option class="mono text-[13px]" value="jpg">JPG</option>
                            <option class="mono text-[13px]" value="png">PNG</option>
                            <option class="mono text-[13px]" value="webp">WEBP</option>
                        </select>
                        </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="mono text-[11px] text-gray-500 uppercase font-bold">{t.common.quality}</label>
                        <input type="range" bind:value={quality} min="10" max="100" step="10" class="w-full accent-red-600" />
                        <span class="text-sm text-gray-600">{quality}%</span>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="mono text-[11px] text-gray-500 uppercase font-bold">{t.imageCompressor.maxWidthOrHeight}</label>
                        <input type="number" bind:value={maxWidthOrHeight} min="0" max="5000" step="100" class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white" />
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
                                <Plus class="w-4 h-4 mr-1" />{t.common.addMore}
                            </button>
                            <button onclick={clearFiles} class="flex items-center border border-gray-300 text-gray-600 mono text-[11px] px-3 py-1 rounded-sm hover:bg-gray-50 transition font-bold uppercase tracking-wider">
                                <Trash2 class="w-4 h-4 mr-1" />{t.common.clear}
                            </button>
                        </div>
                    </div>
                    <p class="text-sm text-gray-800">
                        {t.common.youHaveSelected} <b>{imageQueue.length} {imageQueue.length === 1 ? t.common.fileSelected : t.common.filesSelected}</b> {t.common.totaling} <b>{totalSelectedSize} MB</b>. 
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
                        <label class="mono text-[11px] text-gray-500 uppercase font-bold">{t.common.format}</label>
                        <select bind:value={outputFormat} class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white" id="outputFormat">
                            <option class="mono text-[13px]" value="original">{t.imageCompressor.keepOriginal}</option>
                            <option class="mono text-[13px]" value="jpg">JPG</option>
                            <option class="mono text-[13px]" value="png">PNG</option>
                            <option class="mono text-[13px]" value="webp">WEBP</option>
                        </select>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="mono text-[11px] text-gray-500 uppercase font-bold">{t.common.quality}</label>
                        <input type="range" bind:value={quality} min="10" max="100" step="10" class="w-full accent-red-600" />
                        <span class="text-sm text-gray-600">{quality}%</span>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="mono text-[11px] text-gray-500 uppercase font-bold">{t.imageCompressor.maxWidthOrHeight}</label>
                        <input type="number" bind:value={maxWidthOrHeight} min="0" max="5000" step="100" class="mono text-[13px] px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm bg-white" />
                    </div>
                </section>
                <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff" 
                    multiple 
                    bind:this={fileInput} 
                    class="hidden" 
                    onchange={(e) => handleFiles(Array.from(e.currentTarget.files || []))} 
                />
                <button onclick={startCompression} disabled={imageQueue.length === 0} class="w-full bg-[#10b981] text-white mono text-[13px] py-3 rounded-sm hover:bg-green-700 transition disabled:opacity-50 font-bold uppercase tracking-wider">
                    {t.imageCompressor.compressNow}
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

                <p class="mono text-center text-[12px] text-slate-400 tracking-widest font-medium" style="margin-top: 25px !important">
                    {@html t.imageCompressor.tips}
                </p>
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
            <p class="mono text-center text-[12px] text-slate-400 tracking-widest font-medium" style="margin-top: 25px !important">
                {@html t.imageCompressor.tips}
            </p>
        {/if}

        {#if showFilePanel}
            <FileListPanel 
                fileQueue={imageQueue} 
                {status} 
                {t} 
                onClose={() => showFilePanel = false} 
                onRemove={removeFile} 
                {formatBytes} 
                getSavedPercentage={getReducedPercentage} 
            />
        {/if}
    </div>
</div>
