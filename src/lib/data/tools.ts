export type CategoryId = 'video' | 'image' | 'audio' | 'system';

export interface CategoryMetadata {
  name: string;
}

export const categoryNames: Record<CategoryId, { en: CategoryMetadata, 'zh-TW': CategoryMetadata }> = {
  video: {
    en: { name: 'Video Tools' },
    'zh-TW': { name: '影片工具' }
  },
  image: {
    en: { name: 'Image Tools' },
    'zh-TW': { name: '圖片工具' }
  },
  audio: {
    en: { name: 'Audio Tools' },
    'zh-TW': { name: '音訊工具' }
  },
  system: {
    en: { name: 'System Tools' },
    'zh-TW': { name: '系統工具' }
  }
};

export interface ToolMetadata {
  title: string;
  description: string;
  shortDesc: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ToolConfig {
  id: string;
  categoryId: CategoryId;
  slug: string;
  icon: string;
  i18n: {
    en: ToolMetadata;
    'zh-TW': ToolMetadata;
  };
}

export const tools: ToolConfig[] = [
  // --- 01 // VIDEO ---
  {
    id: 'video-compressor',
    categoryId: 'video',
    slug: 'video-compressor',
    icon: 'Minimize2',
    i18n: {
      en: {
        title: 'Video Compressor',
        shortDesc: 'Reduce video size without quality loss',
        description: 'Compress videos online free. Reduce MP4 file size without quality loss locally.',
        metaTitle: 'Video Compressor - Reduce Video Size Online Free',
        metaDescription: 'Compress MP4, MOV, and WebM videos locally in your browser. No upload required, preserving 100% privacy.',
        keywords: ['compress video', 'reduce mp4 size', 'local video optimization']
      },
      'zh-TW': {
        title: '影片壓縮',
        shortDesc: '無損壓縮影片大小',
        description: '線上免費壓縮影片。在不損失畫質的情況下減小 MP4 檔案大小。',
        metaTitle: '影片壓縮線上免費版 - 縮小影片檔案大小不傷畫質 (免上傳)',
        metaDescription: '在瀏覽器在地處理影片壓縮，支援 MP4、MOV 格式。檔案不需傳上雲端，保護隱私且速度極快。',
        keywords: ['影片壓縮', '縮小影片', 'MP4 壓縮', '在地處理']
      }
    }
  },
  {
    id: 'video-converter',
    categoryId: 'video',
    slug: 'video-converter',
    icon: 'RefreshCw',
    i18n: {
      en: {
        title: 'Video Converter',
        shortDesc: 'Convert between formats instantly',
        description: 'Free video converter tool. Convert MP4 to MOV or any format locally.',
        metaTitle: 'Video Converter - Fast & Private Format Changer',
        metaDescription: 'Convert between MP4, MOV, AVI, and WebM formats locally in your browser.',
        keywords: ['video converter', 'mp4 to mov', 'video format changer']
      },
      'zh-TW': {
        title: '影片轉檔',
        shortDesc: '快速轉換影片格式',
        description: '免費影片轉檔工具。在地轉換 MP4、MOV 或任何格式。',
        metaTitle: '線上影片轉檔工具 - 免費轉換 MP4, MOV, WebM 格式',
        metaDescription: '多功能影片格式轉換器，支援所有主流格式。瀏覽器在地處理，無須上傳，安全可靠。',
        keywords: ['影片轉檔', 'MP4 轉檔', '影片格式轉換', 'MOV 轉 MP4']
      }
    }
  },
  {
    id: 'video-to-mp3',
    categoryId: 'video',
    slug: 'video-to-mp3',
    icon: 'Music',
    i18n: {
      en: {
        title: 'Video to MP3',
        shortDesc: 'Extract audio from video files',
        description: 'Convert video to MP3 online free. Extract audio from videos quickly.',
        metaTitle: 'Video to MP3 Converter - Extract High-Quality Audio',
        metaDescription: 'Fastest way to extract MP3 audio from video files locally. 100% private.',
        keywords: ['video to mp3', 'extract audio from video', 'mp4 to mp3']
      },
      'zh-TW': {
        title: '影片轉 MP3',
        shortDesc: '從影片提取音訊',
        description: '線上免費將影片轉為 MP3。快速從影片中提取高品質音訊。',
        metaTitle: '影片轉 MP3 線上免費工具 - 從影片快速提取音訊 (免上傳)',
        metaDescription: '快速從 MP4 或 MOV 影片中提取高品質 MP3。在地處理，檔案不離身，隱私有保障。',
        keywords: ['影片轉 MP3', '影片轉音檔', 'MP4 轉 MP3', '提取音訊']
      }
    }
  },
  {
    id: 'video-to-gif',
    categoryId: 'video',
    slug: 'video-to-gif',
    icon: 'Film',
    i18n: {
      en: {
        title: 'Video to GIF',
        shortDesc: 'Create animated GIFs from videos',
        description: 'Convert video to GIF free online. High-quality GIF maker tool.',
        metaTitle: 'Video to GIF Maker - Create High-Quality Animations',
        metaDescription: 'Turn your video clips into animated GIFs locally in your browser.',
        keywords: ['video to gif', 'gif maker', 'mp4 to gif']
      },
      'zh-TW': {
        title: '影片轉 GIF',
        shortDesc: '將影片製作成動圖',
        description: '線上免費將影片轉換為 GIF。高品質 GIF 製作工具。',
        metaTitle: '影片轉 GIF 線上免費工具 - 秒速製作高品質動圖',
        metaDescription: '將影片片段轉換為 GIF 動態圖片，簡單快速，適合 Dcard、PTT 分享，完全在地處理。',
        keywords: ['影片轉 GIF', '製作 GIF', '影片轉動圖']
      }
    }
  },

  // --- 02 // IMAGES ---
  {
    id: 'heic-to-jpg',
    categoryId: 'image',
    slug: 'heic-to-jpg',
    icon: 'Smartphone',
    i18n: {
      en: {
        title: 'HEIC to JPG',
        shortDesc: 'Convert iPhone photos to JPG',
        description: 'Free HEIC to JPG converter online. No upload required.',
        metaTitle: 'HEIC to JPG - Convert iPhone Photos Locally',
        metaDescription: 'Convert HEIC images to JPG in your browser. Safe, private, and fast.',
        keywords: ['heic to jpg', 'iphone image converter', 'heic converter']
      },
      'zh-TW': {
        title: 'HEIC 轉 JPG',
        shortDesc: 'iPhone 照片轉 JPG',
        description: '線上免費 HEIC 轉 JPG 轉換器。在地處理，無需上傳。',
        metaTitle: 'HEIC 轉 JPG 線上免費工具 - 批次轉換 iPhone 照片 (免上傳)',
        metaDescription: '專為 iPhone 使用者設計，快速將 HEIC 轉為 JPG。保護隱私，檔案不傳雲端，秒速完成。',
        keywords: ['HEIC 轉 JPG', 'iPhone 照片轉檔', 'HEIC 轉換']
      }
    }
  },
  {
    id: 'pdf-to-jpg',
    categoryId: 'image',
    slug: 'pdf-to-jpg',
    icon: 'FileImage',
    i18n: {
      en: {
        title: 'PDF to JPG',
        shortDesc: 'Extract images from PDF files',
        description: 'Convert PDF to JPG free online. High-quality PDF to image converter.',
        metaTitle: 'PDF to JPG Converter - Extract PDF Pages as Images',
        metaDescription: 'Convert each PDF page into a high-quality JPG image locally.',
        keywords: ['pdf to jpg', 'pdf to image', 'extract images from pdf']
      },
      'zh-TW': {
        title: 'PDF 轉 JPG',
        shortDesc: '從 PDF 提取圖片',
        description: '線上免費將 PDF 轉為 JPG。高品質 PDF 轉圖片工具。',
        metaTitle: 'PDF 轉 JPG 線上免費工具 - 快速將 PDF 頁面轉為圖片',
        metaDescription: '最安全的 PDF 轉檔工具，100% 在地處理。快速將 PDF 每一頁轉換為高品質 JPG 照片。',
        keywords: ['PDF 轉 JPG', 'PDF 轉圖片', 'PDF 轉檔']
      }
    }
  },
  {
    id: 'image-compressor',
    categoryId: 'image',
    slug: 'image-compressor',
    icon: 'Image',
    i18n: {
      en: {
        title: 'Image Compressor',
        shortDesc: 'Optimize images for web performance',
        description: 'Free image compressor online. Reduce JPG, PNG file size.',
        metaTitle: 'Image Compressor - Batch Compress JPG & PNG',
        metaDescription: 'Optimize your images for faster web loading without losing quality.',
        keywords: ['image compressor', 'reduce photo size', 'optimize images']
      },
      'zh-TW': {
        title: '圖片壓縮',
        shortDesc: '縮小照片檔案大小',
        description: '線上免費圖片壓縮。減小 JPG、PNG 檔案大小。',
        metaTitle: '圖片壓縮線上免費版 - 批次縮小照片 KB 數不傷畫質',
        metaDescription: '在地處理圖片壓縮，支援 JPG、PNG、WebP。大幅減少檔案大小，提升網頁載入速度。',
        keywords: ['圖片壓縮', '縮小照片', '照片壓縮', '在地處理']
      }
    }
  },

  // --- 03 // AUDIO ---
  {
    id: 'audio-to-text',
    categoryId: 'audio',
    slug: 'audio-to-text',
    icon: 'Type',
    i18n: {
      en: {
        title: 'Audio to Text',
        shortDesc: 'Transcribe audio to text free online',
        description: 'Convert speech to text accurately. AI-powered transcription tool.',
        metaTitle: 'Audio to Text - Accurate AI Transcription Online',
        metaDescription: 'Transcribe any audio file to text locally in your browser. Fast and private.',
        keywords: ['audio to text', 'transcription', 'speech to text converter']
      },
      'zh-TW': {
        title: '音訊轉文字',
        shortDesc: '錄音檔快速轉逐字稿',
        description: '線上免費音訊轉文字。精準 AI 轉譯工具。',
        metaTitle: '音訊轉文字線上免費工具 - 快速生成逐字稿 (在地處理)',
        metaDescription: '支援 MP3、WAV、M4A 錄音檔轉文字。100% 在地 AI 運算，保護隱私，省去手打逐字稿的時間。',
        keywords: ['音訊轉文字', '逐字稿', '錄音轉文字', 'AI 聽寫']
      }
    }
  },
  {
    id: 'speech-to-text',
    categoryId: 'audio',
    slug: 'speech-to-text',
    icon: 'Mic',
    i18n: {
      en: {
        title: 'Speech to Text',
        shortDesc: 'Transcribe voice recordings accurately',
        description: 'Free speech to text converter online. Local AI speech recognition tool.',
        metaTitle: 'Speech to Text - Accurate AI Transcription Online',
        metaDescription: 'Convert speech to text locally using browser-based AI. Private and fast.',
        keywords: ['speech to text', 'voice transcription', 'audio to text']
      },
      'zh-TW': {
        title: '語音轉文字',
        shortDesc: '精準 AI 語音辨識',
        description: '線上免費語音轉文字。在地 AI 語音辨識工具。',
        metaTitle: '語音轉文字線上免費工具 - AI 語音辨識 (在地處理)',
        metaDescription: '即時將語音轉換為文字，支援繁體中文。檔案不需上傳，保護會議紀錄隱私。',
        keywords: ['語音轉文字', 'AI 語音辨識', '即時逐字稿']
      }
    }
  },
  {
    id: 'm4a-to-mp3',
    categoryId: 'audio',
    slug: 'm4a-to-mp3',
    icon: 'FileAudio',
    i18n: {
      en: {
        title: 'M4A to MP3',
        shortDesc: 'Convert voice memos to MP3',
        description: 'Convert M4A to MP3 free online. High-quality audio conversion.',
        metaTitle: 'M4A to MP3 Converter - Fast Local Audio Tool',
        metaDescription: 'Convert your M4A recordings to MP3 format locally in your browser.',
        keywords: ['m4a to mp3', 'audio converter', 'convert voice memo']
      },
      'zh-TW': {
        title: 'M4A 轉 MP3',
        shortDesc: 'iPhone 錄音轉檔',
        description: '線上免費將 M4A 轉為 MP3。高品質音訊轉換。',
        metaTitle: 'M4A 轉 MP3 線上免費工具 - 快速轉換 iPhone 錄音檔',
        metaDescription: '將 iPhone 的 M4A 錄音檔快速轉換為高品質 MP3。在地轉換，安全、快速、免費。',
        keywords: ['M4A 轉 MP3', '音訊轉檔', '錄音檔轉檔']
      }
    }
  },

  // --- 04 // SYSTEM ---
  {
    id: 'bulk-rename',
    categoryId: 'system',
    slug: 'bulk-rename',
    icon: 'PencilLine',
    i18n: {
      en: {
        title: 'Bulk Rename',
        shortDesc: 'Rename multiple files quickly',
        description: 'Bulk rename files free online. Rename multiple files using patterns.',
        metaTitle: 'Bulk Rename Online - Rename Files Fast & Safe',
        metaDescription: 'Rename hundreds of files instantly in your browser using smart patterns.',
        keywords: ['bulk rename', 'batch rename files', 'rename tool']
      },
      'zh-TW': {
        title: '批次重新命名',
        shortDesc: '大量改名工具',
        description: '線上免費批次重新命名。使用模式快速命名多個檔案。',
        metaTitle: '批次重新命名線上工具 - 快速安全更改大量檔案名稱',
        metaDescription: '強大的在地批次命名工具，支援各種命名模式。處理過程完全在瀏覽器完成，安全無慮。',
        keywords: ['批次重新命名', '大量改名', '檔案命名工具']
      }
    }
  }
];
