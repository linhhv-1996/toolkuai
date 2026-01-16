export const siteConfig = {
  // Ngôn ngữ gốc/mặc định của site
  defaultLang: 'en' as const,
  
  // Danh sách các ngôn ngữ được hỗ trợ
  languages: [
    { id: 'en', label: 'EN', path: '' },
    { id: 'zh-TW', label: 'ZH-TW', path: 'zh-tw' }
  ] as const,
  
  // Helper để kiểm tra ngôn ngữ hợp lệ
  supportedLangs: ['en', 'zh-TW'] as const
};

export type SupportedLang = (typeof siteConfig.supportedLangs)[number];

export const getLangFromPath = (path: string | undefined): SupportedLang => {
  // Nếu path trống (ví dụ: domain.com/video-compressor) -> mặc định là 'en'
  if (!path) return siteConfig.defaultLang;

  // Tìm trong list languages xem có thằng nào có path khớp không
  const lang = siteConfig.languages.find(l => l.path.toLowerCase() === path.toLowerCase());
  
  return lang ? (lang.id as SupportedLang) : siteConfig.defaultLang;
};
