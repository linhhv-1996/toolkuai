// src/lib/configs/tool-config.ts

import type { SupportedLang } from "./siteConfig";

export type CategoryId = 'video' | 'image' | 'audio' | 'system' | 'PDF';

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
  },
  PDF: {
    en: { name: 'PDF Tools' },
    'zh-TW': { name: 'PDF 工具' }
  }
};

export interface ToolMetadata {
  slug: string; // Slug riêng cho từng ngôn ngữ
  title: string;
  description: string;
  shortDesc: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ToolConfig {
  id: string; // ID duy nhất để map giữa các ngôn ngữ
  categoryId: CategoryId;
  componentId: String;
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
    icon: 'Minimize2',
    componentId: 'VideoCompressor',
    i18n: {
      en: {
        slug: 'video-compressor',
        title: 'Video Compressor',
        shortDesc: 'Reduce video size without quality loss',
        description: 'Compress videos online free. Reduce MP4 file size without quality loss locally.',
        metaTitle: 'Video Compressor - Reduce Video Size Online Free',
        metaDescription: 'Compress MP4, MOV, and WebM videos locally in your browser. No upload required, preserving 100% privacy.',
        keywords: ['compress video', 'reduce mp4 size', 'local video optimization']
      },
      'zh-TW': {
        slug: 'video-compressor',
        title: '影片壓縮',
        shortDesc: '線上縮小影片檔案大小，不傷畫質',
        description: '免費線上影片壓縮工具。在地端完成 MP4、MOV 轉檔，無需上傳檔案，確保 100% 隱私。',
        metaTitle: '影片壓縮線上免費版 - 快速縮小影片檔案大小 (免上傳/不傷畫質)',
        metaDescription: '最安全的影片壓縮工具。支援 MP4 與 MOV 格式，完全在瀏覽器在地處理，檔案不需傳上雲端，保護隱私且速度極快。',
        keywords: ['影片壓縮', '影片轉檔', '縮小影片', 'MP4 壓縮', '影片瘦身']
      }
    }
  },
  // --- 02 // IMAGES ---
  {
    id: 'heic-to-jpg',
    categoryId: 'image',
    icon: 'Smartphone',
    componentId: 'Heic2Jpeg',
    i18n: {
      en: {
        slug: 'heic-to-jpg',
        title: 'HEIC to JPG',
        shortDesc: 'Convert iPhone photos to JPG',
        description: 'Free HEIC to JPG converter online. No upload required.',
        metaTitle: 'HEIC to JPG - Convert iPhone Photos Locally',
        metaDescription: 'Convert HEIC images to JPG in your browser. Safe, private, and fast.',
        keywords: ['heic to jpg', 'iphone image converter', 'heic converter']
      },
      'zh-TW': {
        slug: 'heic-to-jpg',
        title: 'HEIC 轉 JPG',
        shortDesc: 'iPhone 照片轉 JPG 轉換器',
        description: '最強線上免費 HEIC 轉 JPG 工具。在地瀏覽器處理，批次轉換 iPhone 照片免上傳。',
        metaTitle: 'HEIC 轉 JPG 線上免費工具 - 批次轉換 iPhone 照片 (免上傳/高畫質)',
        metaDescription: '專為 iPhone 使用者設計，秒速將 HEIC 轉為 JPG。保護隱私，檔案不傳雲端，支援批次在地處理。',
        keywords: ['HEIC 轉 JPG', 'HEIC 轉檔', 'iPhone 照片轉檔', 'HEIC 轉換', 'HEIC converter']
      }
    }
  },
  {
    id: 'image-compressor',
    categoryId: 'image',
    icon: 'Image',
    componentId: 'ImageCompressor',
    i18n: {
      en: {
        slug: 'image-compressor',
        title: 'Image Compressor',
        shortDesc: 'Optimize images for web performance',
        description: 'Free image compressor online. Reduce JPG, PNG file size.',
        metaTitle: 'Image Compressor - Batch Compress JPG & PNG',
        metaDescription: 'Optimize your images for faster web loading without losing quality.',
        keywords: ['image compressor', 'reduce photo size', 'optimize images']
      },
      'zh-TW': {
        slug: 'image-compressor',
        title: '圖片壓縮',
        shortDesc: '線上縮小照片與圖片檔案大小',
        description: '免費線上圖片壓縮工具。大幅減小 JPG、PNG、WebP 檔案 KB 數，提升網頁載入速度。',
        metaTitle: '圖片壓縮線上免費版 - 批次縮小照片 KB 數 (不傷畫質/免上傳)',
        metaDescription: '在地處理圖片壓縮，檔案不留伺服器。支援 JPG、PNG 格式，在維持畫質的同時達到最大壓縮率。',
        keywords: ['圖片壓縮', '縮小圖片', '照片壓縮', 'JPG 壓縮', '圖片縮小']
      }
    }
  },
  {
    id: 'pdf-compressor',
    categoryId: 'PDF',
    icon: 'FileText',
    componentId: 'PdfCompressor',
    i18n: {
      en: {
        slug: 'pdf-compressor',
        title: 'PDF Compressor',
        shortDesc: 'Shrink PDF file size without losing quality',
        description: 'Free online PDF compressor. Local browser-side processing for 100% privacy.',
        metaTitle: 'PDF Compressor - Compress PDF Online (Privacy First & Secure)',
        metaDescription: 'Reduce PDF file size locally in your browser. No files are uploaded to our server, ensuring 100% security for your sensitive documents.',
        keywords: ['pdf compressor', 'reduce pdf size', 'shrink pdf online', 'private pdf compression', 'compress pdf locally']
      },
      'zh-TW': {
        slug: 'pdf-compressor',
        title: 'PDF 壓縮',
        shortDesc: '線上縮小 PDF 檔案大小，專業不傷畫質',
        description: '最強線上免費 PDF 壓縮工具。完全在地處理，合約與私人文件免上傳，確保 100% 隱私安全。',
        metaTitle: 'PDF 壓縮線上免費版 - 免上傳、100% 隱私保護、快速縮小 PDF 檔案',
        metaDescription: '全台最快、最安全的 PDF 壓縮工具。所有處理都在您的瀏覽器執行，檔案不傳雲端，確保合約與公文安全不外洩。',
        keywords: ['PDF 壓縮', '縮小 PDF', 'PDF 檔案壓縮', 'PDF 瘦身', 'PDF 減肥', 'PDF 免上傳']
      }
    }
  },
];

// Hàm Helper để tìm tool theo slug và ngôn ngữ
export const getToolBySlug = (slug: string, lang: SupportedLang) => {
  // lang lúc này chắc chắn là 'en' hoặc 'zh-TW' (đã khớp key của i18n)
  return tools.find(tool => {
    // Phải kiểm tra slug của đúng ngôn ngữ đó
    return tool.i18n[lang].slug === slug;
  });
};
