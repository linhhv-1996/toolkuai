<!-- <script lang="ts">
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
    <div class="font-bold text-[15px] mb-1 text-gray-800">{t.common.dropTitle}</div>
    <div class="mono text-[11px] text-gray-400 uppercase tracking-tight">{t.common.dropDesc}</div>
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
</label> -->

<script lang="ts">
    import { UploadCloud } from "lucide-svelte";
    let {
        onFilesSelected,
        accept = "*",
        multiple = true,
        t,
        disabled = false,
    }: {
        onFilesSelected: (files: File[]) => void;
        accept?: string;
        multiple?: boolean;
        t: any;
        disabled?: boolean;
    } = $props();

    let isDragging = $state(false);
</script>

<label
    class="border-2 border-dashed border-gray-200 rounded-sm p-10 text-center cursor-pointer hover:border-[#10b981] transition-all block {isDragging
        ? 'border-[#10b981] bg-green-50'
        : ''} {disabled ? 'opacity-50 pointer-events-none' : ''}"
    ondragover={(e) => {
        if (disabled) return;
        e.preventDefault();
        isDragging = true;
    }}
    ondragleave={() => (isDragging = false)}
    ondrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        isDragging = false;
        if (e.dataTransfer?.files)
            onFilesSelected(Array.from(e.dataTransfer.files));
    }}
>
    <UploadCloud class="w-8 h-8 text-gray-500 mx-auto mb-2" />
    <div class="font-bold text-[15px] mb-1 text-gray-800">{t.common.dropTitle}</div>
    <div class="mono text-[11px] text-gray-400 uppercase tracking-tight">{t.common.dropDesc}</div>
    <input
        type="file"
        {multiple}
        {accept}
        class="hidden"
        onchange={(e) => {
            if (disabled) return;
            const files = (e.target as HTMLInputElement).files;
            if (files) onFilesSelected(Array.from(files));
        }}
    />
</label>
