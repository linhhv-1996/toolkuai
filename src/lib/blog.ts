import type { SupportedLang } from '$lib/data/siteConfig';
import { render } from 'svelte/server';

export async function getLatestPosts(lang: SupportedLang, limit = 3) {
    // Quét toàn bộ file .md trong folder content/blog
    // Dùng eager: true để lấy metadata ngay lập tức
    const allPosts = import.meta.glob('/src/content/blog/**/*.md', { eager: true });
    
    const posts = [];

    for (const path in allPosts) {
        const file = allPosts[path] as any;
        const slug = path.split('/').at(-1)?.replace('.md', '');
        
        // Chỉ lấy các bài thuộc folder ngôn ngữ tương ứng (ví dụ: /en/ hoặc /zh-tw/)
        if (path.includes(`/src/content/blog/${lang.toLowerCase()}/`)) {
            if (file && file.metadata) {
                posts.push({
                    ...file.metadata,
                    slug: slug
                });
            }
        }
    }

    // Sắp xếp bài mới nhất lên đầu và cắt lấy 3 bài
    return posts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
}

export async function getPostBySlug(lang: SupportedLang, slug: string) {
    // Dùng đường dẫn tuyệt đối từ gốc project như mày đã làm ở getLatestPosts
    const allPosts = import.meta.glob('/src/content/blog/**/*.md', { eager: true });
    
    // Tạo path chính xác để map với key trong allPosts
    const path = `/src/content/blog/${lang.toLowerCase()}/${slug}.md`;
    const file = allPosts[path] as any;
    
    if (file && file.metadata) {
        const rendered = render(file.default, {});
        
        return {
            content: rendered.html,
            meta: file.metadata
        };
    }
    return null;
}
