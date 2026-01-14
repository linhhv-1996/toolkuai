<script lang="ts">
    import { UploadCloud } from "lucide-svelte";
    let {
        onFilesSelected,
        accept = "*",
        multiple = true,
        t,
    }: {
        onFilesSelected: (files: File[]) => void;
        accept?: string;
        multiple?: boolean;
        t: any;
    } = $props();

    let isDragging = $state(false);
</script>

<label
    class="border-2 border-dashed border-gray-200 rounded-sm p-10 text-center cursor-pointer hover:border-[#10b981] transition-all block {isDragging
        ? 'border-[#10b981] bg-green-50'
        : ''}"
    ondragover={(e) => {
        e.preventDefault();
        isDragging = true;
    }}
    ondragleave={() => (isDragging = false)}
    ondrop={(e) => {
        e.preventDefault();
        isDragging = false;
        if (e.dataTransfer?.files)
            onFilesSelected(Array.from(e.dataTransfer.files));
    }}
>
    <UploadCloud class="w-8 h-8 text-gray-500 mx-auto mb-2" />
    <div class="font-medium text-sm mb-1">{t.common.dropTitle}</div>
    <div class="mono text-xs text-gray-500">{t.common.dropDesc}</div>
    <input
        type="file"
        {multiple}
        {accept}
        class="hidden"
        onchange={(e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) onFilesSelected(Array.from(files));
        }}
    />
</label>
