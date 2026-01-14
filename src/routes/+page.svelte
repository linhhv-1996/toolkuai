<script>
  import ToolItem from '$lib/components/ToolItem.svelte';
  import BlogItem from '$lib/components/BlogItem.svelte';

  // Dữ liệu tools (hardcode từ HTML)
  const videoTools = [
    { href: '/video-compressor', name: 'Video Compressor', description: 'Compress videos online free · Reduce MP4 file size without quality loss · Local video optimization for faster loading', iconName: 'zap' },
    { href: '/video-converter', name: 'Video Converter', description: 'Free video converter tool · Convert MP4 to MOV or any format locally · Fast, private video format changer', iconName: 'repeat' },
    { href: '/video-to-mp3', name: 'Video to MP3', description: 'Convert video to MP3 online free · Extract audio from videos quickly · High-quality MP3 converter tool', iconName: 'music' },
    { href: '/video-to-gif', name: 'Video to GIF', description: 'Convert video to GIF free online · Create animated GIFs from MP4 videos · High-quality GIF maker tool', iconName: 'film' },
  ];

  const imageTools = [
    { href: '/heic-to-jpg', name: 'HEIC to JPG', description: 'Free HEIC to JPG converter online · Convert iPhone HEIC images to JPG locally · Fast, no upload required', iconName: 'image' },
    { href: '/pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF to JPG free online · Extract images from PDF files locally · High-quality PDF to image converter', iconName: 'file-image' },
    { href: '/image-compressor', name: 'Image Compressor', description: 'Free image compressor online · Reduce JPG, PNG file size without quality loss · Optimize images for web SEO', iconName: 'minimize-2' },
  ];

  const audioTools = [
    { href: '/audio-to-text', name: 'Audio to Text', description: 'Transcribe audio to text free online · Convert speech to text accurately · AI-powered transcription tool', iconName: 'mic' },
    { href: '/speech-to-text', name: 'Speech to Text', description: 'Free speech to text converter online · Transcribe voice recordings accurately · Local AI speech recognition tool', iconName: 'mic-2' },
    { href: '/m4a-to-mp3', name: 'M4A to MP3', description: 'Convert M4A to MP3 free online · High-quality audio format converter · Fast, local M4A file conversion', iconName: 'shuffle' },
  ];

  const systemTools = [
    { href: '/bulk-rename', name: 'Bulk Rename', description: 'Bulk rename files free online · Rename multiple files quickly for SEO · Easy file renaming tool', iconName: 'file-text' },
  ];

  // Dữ liệu blogs
  const blogs = [
    { href: '/blog/post-1', name: 'How Local Processing Saves Your Privacy', description: 'Discover why ToolKuai keeps everything on-device · Jan 14, 2026', iconName: 'book-open' },
    { href: '/blog/post-2', name: 'Top Tips for Video Compression', description: 'Optimize your videos without losing quality · Jan 10, 2026', iconName: 'video' },
    { href: '/blog/post-3', name: 'New Features in ToolKuai v2.1', description: 'Upcoming updates and how they improve local tools · Jan 5, 2026', iconName: 'sparkles' },
  ];
</script>

<main class="max-w-[960px] mx-auto px-6 mb-12 flex flex-col md:flex-row gap-8">
  <!-- LEFT: TOOL LIST -->
  <div class="w-full md:w-7/12 space-y-6">
    <!-- VIDEO -->
    <section>
      <div class="mono text-[11px] tracking-[0.3em] uppercase text-gray-300 mb-2">
        01 // Video
      </div>
      <div class="divide-y divide-gray-100">
        {#each videoTools as tool}
          <ToolItem {...tool} />
        {/each}
      </div>
    </section>

    <!-- IMAGES -->
    <section>
      <div class="mono text-[11px] tracking-[0.3em] uppercase text-gray-300 mb-2">
        02 // Images
      </div>
      <div class="divide-y divide-gray-100">
        {#each imageTools as tool}
          <ToolItem {...tool} />
        {/each}
      </div>
    </section>

    <!-- AUDIO -->
    <section>
      <div class="mono text-[11px] tracking-[0.3em] uppercase text-gray-300 mb-2">
        03 // Audio
      </div>
      <div class="divide-y divide-gray-100">
        {#each audioTools as tool}
          <ToolItem {...tool} />
        {/each}
      </div>
    </section>

    <!-- SYSTEM -->
    <section>
      <div class="mono text-[11px] tracking-[0.3em] uppercase text-gray-300 mb-2">
        04 // System
      </div>
      <div class="divide-y divide-gray-100">
        {#each systemTools as tool}
          <ToolItem {...tool} />
        {/each}
      </div>
    </section>
  </div>

  <!-- RIGHT: BLOG SIDEBAR -->
  <div class="w-full md:w-5/12 sticky top-4 self-start">
    <div class="mono text-[11px] tracking-[0.3em] uppercase text-gray-300 mb-2">
      05 // Blog
    </div>
    <div class="divide-y divide-gray-100">
      {#each blogs as blog}
        <BlogItem {...blog} />
      {/each}
    </div>
    <a href="/blog" class="mono text-[12px] uppercase text-gray-500 hover:text-black transition block text-left mt-6">
      View All Posts →
    </a>
  </div>
</main>
