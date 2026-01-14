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
