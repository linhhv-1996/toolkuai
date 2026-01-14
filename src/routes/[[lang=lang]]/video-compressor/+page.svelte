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
    let status = $state<"idle" | "processing" | "success">("idle");
    let overallProgress = $state(0);
    let zipUrl = $state<string | null>(null);
    let totalSavedBytes = $state(0);

    // Options
    let quality = $state("medium");

    function handleFiles(files: File[]) {
        const newItems = files.map((f) => ({
            file: f,
            status: "pending",
            progress: 0,
        }));
        videoQueue = [...videoQueue, ...newItems];
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
            status = "idle";
        }
    }

    function reset() {
        videoQueue = [];
        zipUrl = null;
        status = "idle";
        overallProgress = 0;
    }
</script>

<main class="max-w-[960px] mx-auto px-6 mb-12">
    <nav class="mb-4">
        <a 
            href="{langPath || '/'}" 
            class="inline-flex items-center space-x-1 text-gray-500 hover:text-[#10b981] transition-colors mono text-xs uppercase tracking-wider group"
        >
            <ChevronLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t.common.backToTools}</span>
        </a>
    </nav>
    
    <div class="mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
            {t.videoCompress.title}
        </h1>
        <p class="text-base text-gray-600 max-w-md mb-6 mx-auto md:mx-0">
            {t.videoCompress.subTitle}
        </p>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-[630px] flex-shrink-0 space-y-6">
            {#if status === "idle"}
                <div class="space-y-6 animate-in fade-in duration-300">
                    <Dropzone
                        onFilesSelected={handleFiles}
                        accept="video/*"
                        {t}
                    />

                    {#if videoQueue.length > 0}
                        <div class="space-y-2">
                            <div
                                class="mono text-xs text-gray-500 mb-2 "
                            >
                                {t.common.selectedFiles}
                            </div>
                            <FileList
                                files={videoQueue}
                                onRemove={(i) =>
                                    (videoQueue = videoQueue.filter(
                                        (_, idx) => idx !== i,
                                    ))}
                                {t}
                                maxHeight="160px"
                            />
                        </div>
                    {/if}
                    <!-- COMPRESSION OPTIONS -->
                    <section id="compressionOptions" class="space-y-4">
                        <div class="mono text-xs text-gray-500 mb-2 ">
                            {t.common.options}
                        </div>
                        <div class="flex flex-col space-y-2">
                            <!-- svelte-ignore a11y_label_has_associated_control -->
                            <label class="mono text-xs text-gray-500 "
                                >{t.videoCompress.quality}</label
                            >
                            <select
                                bind:value={quality}
                                class="mono text-sm px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 rounded-sm"
                                id="qualityLevel"
                            >
                                <option value="high"
                                    >{t.videoCompress.qualityLevels
                                        .high}</option
                                >
                                <option value="medium"
                                    >{t.videoCompress.qualityLevels
                                        .medium}</option
                                >
                                <option value="low"
                                    >{t.videoCompress.qualityLevels.low}</option
                                >
                            </select>
                        </div>
                    </section>

                    <button
                        onclick={startCompression}
                        disabled={videoQueue.length === 0}
                        class="w-full bg-[#10b981] text-white mono text-sm py-3 rounded-sm hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {t.videoCompress.start}
                    </button>
                </div>
            {:else if status === "processing"}
                <div class="space-y-6 animate-in fade-in duration-300">
                    <div class="mono text-xs text-gray-500 ">
                        {t.common.processing}
                    </div>
                    <FileList files={videoQueue} {t} maxHeight="300px" />
                    <ProcessingState progress={overallProgress} {t} />
                </div>
            {:else if status === "success"}
                <div class="space-y-6 animate-in fade-in duration-300">
                    <div class="mono text-xs text-gray-500 ">
                        {t.common.results}
                    </div>
                    <FileList files={videoQueue} {t} maxHeight="200px" />
                    <SuccessState
                        savedSize={(totalSavedBytes / 1024 / 1024).toFixed(1) +
                            " MB"}
                        {zipUrl}
                        onReset={reset}
                        {t}
                    />
                </div>
            {/if}

            <article
                class="
                prose prose-sm md:prose-base max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-[#10b981] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-code:text-[#10b981] prose-code:bg-gray-50 prose-code:px-1 prose-code:rounded
                prose-img:rounded-sm border-t border-gray-100 pt-6
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
