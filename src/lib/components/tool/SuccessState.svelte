<!-- <script lang="ts">
    import { CheckCircle2, FileDown, Twitter } from "lucide-svelte";
    let { savedSize, zipUrl, onReset, t }: { savedSize: string, zipUrl: string | null, onReset: () => void, t: any } = $props();
</script>

<section class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div class="p-6 bg-green-50 border border-green-100 rounded-sm text-center">
        <CheckCircle2 class="w-8 h-8 text-[#10b981] mx-auto mb-2" />
        <div class="font-bold text-[18px] mb-1 text-gray-800">{t.common.success}</div>
        <div class="mono text-[11px] text-gray-600 uppercase tracking-tight font-medium">
            {t.common.savedMessage.replace('{size}', savedSize)}
        </div>
    </div>

    <div class="space-y-3">
        {#if zipUrl}
            <a href={zipUrl} download="toolkuai_videos.zip" class="w-full bg-[#10b981] text-white mono text-[13px] py-4 rounded-sm hover:bg-green-700 transition flex items-center justify-center space-x-2 font-bold uppercase tracking-wider">
                <FileDown class="w-4 h-4" />
                <span>{t.common.downloadAll}</span>
            </a>
        {/if}
        <button onclick={onReset} class="w-full border border-[#10b981] text-[#10b981] mono text-[13px] py-3 rounded-sm hover:bg-green-50 transition font-bold uppercase tracking-wider">
            {t.common.compressMore}
        </button>
    </div>

    <div class="p-4 bg-gray-100 rounded-sm mono text-[11px] text-gray-500 flex justify-between items-center uppercase tracking-tight">
        <span>{t.common.shareResults}:</span>
        <button class="text-[#10b981] flex items-center space-x-1 hover:underline font-bold">
            <Twitter class="w-3 h-3" />
            <span>{t.common.tweetIt}</span>
        </button>
    </div>
</section> -->

<script lang="ts">
    import { CheckCircle2, FileDown, Twitter } from "lucide-svelte";
    let { savedSize, zipUrl, onReset, t, showPlaceholder = false }: { savedSize: string, zipUrl: string | null, onReset: () => void, t: any, showPlaceholder?: boolean } = $props();
</script>

<section class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    {#if showPlaceholder}
        <div class="p-6 bg-green-50 border border-green-100 rounded-sm text-center invisible">Placeholder</div>
        <div class="space-y-3 invisible">
            <a class="w-full bg-[#10b981] text-white mono text-[13px] py-4 rounded-sm flex items-center justify-center space-x-2 font-bold uppercase tracking-wider">
                <FileDown class="w-4 h-4" />
                <span>{t.common.downloadAll}</span>
            </a>
            <button class="w-full border border-[#10b981] text-[#10b981] mono text-[13px] py-3 rounded-sm font-bold uppercase tracking-wider">
                {t.common.compressMore}
            </button>
        </div>
        <div class="p-4 bg-gray-100 rounded-sm mono text-[11px] text-gray-500 flex justify-between items-center uppercase tracking-tight invisible">
            Placeholder
        </div>
    {:else}
        <div class="p-6 bg-green-50 border border-green-100 rounded-sm text-center">
            <CheckCircle2 class="w-8 h-8 text-[#10b981] mx-auto mb-2" />
            <div class="font-bold text-[18px] mb-1 text-gray-800">{t.common.success}</div>
            <div class="mono text-[11px] text-gray-600 uppercase tracking-tight font-medium">
                {t.common.savedMessage.replace('{size}', savedSize)}
            </div>
        </div>

        <div class="space-y-3">
            {#if zipUrl}
                <a href={zipUrl} download="toolkuai_videos.zip" class="w-full bg-[#10b981] text-white mono text-[13px] py-4 rounded-sm hover:bg-green-700 transition flex items-center justify-center space-x-2 font-bold uppercase tracking-wider">
                    <FileDown class="w-4 h-4" />
                    <span>{t.common.downloadAll}</span>
                </a>
            {/if}
            <button onclick={onReset} class="w-full border border-[#10b981] text-[#10b981] mono text-[13px] py-3 rounded-sm hover:bg-green-50 transition font-bold uppercase tracking-wider">
                {t.common.compressMore}
            </button>
        </div>

        <div class="p-4 bg-gray-100 rounded-sm mono text-[11px] text-gray-500 flex justify-between items-center uppercase tracking-tight">
            <span>{t.common.shareResults}:</span>
            <button class="text-[#10b981] flex items-center space-x-1 hover:underline font-bold">
                <Twitter class="w-3 h-3" />
                <span>{t.common.tweetIt}</span>
            </button>
        </div>
    {/if}
</section>
