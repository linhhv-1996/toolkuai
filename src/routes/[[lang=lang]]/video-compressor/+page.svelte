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
    import FileList from "$lib/components/tool/FileList.svelte";
    import ProcessingState from "$lib/components/tool/ProcessingState.svelte";
    import SuccessState from "$lib/components/tool/SuccessState.svelte";
    import BlogSidebar from "$lib/components/BlogSidebar.svelte";
    import { ChevronLeft } from "lucide-svelte";

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
    // Options
    let quality = $state("medium");
    let fileInput = $state();

   $effect(() => {
        if (videoQueue.length > 0 && status === "idle") {
            status = "selected";
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

    // Add drop over whole main for add more
    function handleDrop(e) {
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
        try {
            for (let i = 0; i < videoQueue.length; i++) {
                const item = videoQueue[i];
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
            <div class="tool-box bg-white rounded-sm border border-gray-200 p-6 space-y-6" style="height: 400px; overflow: auto;"> <!-- Fixed height X = 400px, scroll nếu dài -->
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
                            <div class="mono text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                                {t.common.selectedFiles}
                            </div>
                            <FileList files={videoQueue} onRemove={(i) => (videoQueue = videoQueue.filter((_, idx) => idx !== i))} {t} maxHeight="200px" style="min-height: 200px;" /> <!-- Fixed = Dropzone height -->
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
                        <button onclick={addMoreFiles} class="w-full border border-[#10b981] text-[#10b981] mono text-[13px] py-3 rounded-sm hover:bg-green-50 transition font-bold uppercase tracking-wider">
                            {t.common.addMoreFiles}
                        </button>
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
                            <FileList files={videoQueue} {t} maxHeight="200px" style="min-height: 200px;" />
                        </div>
                        <ProcessingState progress={overallProgress} {t} />
                    </div>
                {:else if status === "success"}
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <div class="mono text-[11px] text-gray-500 uppercase tracking-widest font-bold">
                                {t.common.results}
                            </div>
                            <FileList files={videoQueue} {t} maxHeight="200px" style="min-height: 200px;" />
                        </div>
                        <SuccessState savedSize={(totalSavedBytes / 1024 / 1024).toFixed(1) + " MB"} {zipUrl} onReset={reset} {t} />
                    </div>
                {/if}
            </div>
            <!-- Ads dưới box, ngoài, min-height fixed, conditional processing -->
            <div class="ad-container mt-6 text-center" style="min-height: 90px; background: #f0f0f0;"> <!-- Placeholder gray, fixed height -->
                {#if status === "processing"}
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-XXXX"
                         data-ad-slot="PROCESSING_AD_SLOT"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                {:else}
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-XXXX"
                         data-ad-slot="DEFAULT_AD_SLOT"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                {/if}
            </div>
            <article
                class="
                    prose max-w-none
                    prose-headings:text-slate-900 prose-headings:tracking-tight prose-headings:font-extrabold
                    prose-h2:text-[18px] prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2
                    prose-h3:text-[15px] prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-[14px] prose-p:text-slate-600/90 prose-p:leading-relaxed prose-p:mb-4
                    prose-li:text-[14px] prose-li:text-slate-600/90 prose-li:mb-1
                    prose-a:text-[#10b981] prose-a:no-underline hover:prose-a:underline font-bold
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-code:text-[#10b981] prose-code:bg-slate-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[12px]
                    border-t border-gray-100 pt-10 mt-16
                "
            >
                {#if MarkdownContent}
                    <MarkdownContent />
                {/if}
            </article>
        </div>
        <BlogSidebar lang={currentLang} />
    </div>
</main>
