<!-- <script lang="ts">
    let { progress, t }: { progress: number, t: any } = $props();
</script>

<section class="space-y-4">
    <div class="mono text-[11px] text-gray-500 uppercase tracking-widest font-bold">{t.common.progress}</div>
    <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div class="bg-[#10b981] h-full transition-all duration-300" style="width: {progress}%"></div>
    </div>
    <div class="p-4 bg-gray-50 rounded-sm mono text-[11px] text-gray-600 border border-gray-100 uppercase tracking-tight">
        {t.common.tips} <a href="/blog" class="text-[#10b981] hover:underline font-bold">{t.common.readNow} →</a>
    </div>
</section> -->

<script lang="ts">
    let { progress, t, showPlaceholder = false }: { progress: number, t: any, showPlaceholder?: boolean } = $props();
</script>

<section class="space-y-4">
    {#if showPlaceholder}
        <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"></div>
        <div class="p-4 bg-gray-50 rounded-sm mono text-[11px] text-gray-600 border border-gray-100 uppercase tracking-tight invisible">
            Placeholder
        </div>
    {:else}
        <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#10b981] h-full transition-all duration-300" style="width: {progress}%"></div>
        </div>
        <div class="p-4 bg-gray-50 rounded-sm mono text-[11px] text-gray-600 border border-gray-100 uppercase tracking-tight">
            {t.common.tips} <a href="/blog" class="text-[#10b981] hover:underline font-bold">{t.common.readNow} →</a>
        </div>
    {/if}
</section>
