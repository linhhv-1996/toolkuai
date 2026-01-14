<script lang="ts">
    let { progress, t }: { progress: number, t: any } = $props();
</script>

<section class="space-y-4">
    <div class="mono text-xs text-gray-500 ">{t.common.progress}</div>
    <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div class="bg-[#10b981] h-full transition-all duration-300" style="width: {progress}%"></div>
    </div>
    <div class="p-4 bg-gray-50 rounded-sm mono text-xs text-gray-600 border border-gray-100">
        {t.common.tips} <a href="/blog" class="text-[#10b981] hover:underline">{t.common.readNow} →</a>
    </div>
</section>
