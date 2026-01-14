import type { SupportedLang } from './siteConfig';

export const ui: Record<SupportedLang, any> = {
  en: {
    nav: { blog: "Blog", searchPlaceholder: "Search tools..." },
    hero: {
      lightning: "LIGHTNING FAST",
      local: "LOCAL",
      processing: "PROCESSING.",
      kuaiDesc: "Where 'Kuai' means Fast.",
      privacyDesc: "Your data never leaves your device.",
      howItWorks: "How it Works →"
    },
    footer: { builtFor: "Built for Privacy", privacy: "Privacy Policy", github: "Github", contact: "Contact" }
  },
  'zh-TW': {
    nav: { blog: "部落格", searchPlaceholder: "搜尋工具..." },
    hero: {
      lightning: "極速",
      local: "在地",
      processing: "處理。",
      kuaiDesc: "「快」代表速度。",
      privacyDesc: "您的資料永遠不會離開您的裝置。",
      howItWorks: "運作原理 →"
    },
    footer: { builtFor: "專為隱私打造", privacy: "隱私政策", github: "Github", contact: "聯絡我們" }
  }
};
