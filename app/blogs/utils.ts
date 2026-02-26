// utils.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export type BlogPostMetadata = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
};

export const BLOGS_DIR = path.join(process.cwd(), 'contents', 'blogs');
const POSTS_PER_PAGE = 10;

async function getAllPostMetadata(): Promise<BlogPostMetadata[]> {
  try {
    const files = await fs.readdir(BLOGS_DIR, { withFileTypes: true });
    const mdxFiles = files.filter(
      (file) => file.isFile() && file.name.endsWith('.mdx')
    );
    const postsPromises = mdxFiles.map(async (file) => {
      const filePath = path.join(BLOGS_DIR, file.name);
      const source = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(source); // 只提取 frontmatter
      return {
        slug: file.name.replace(/\.mdx$/, ''),
        title: data.title || '无标题',
        description: data.description || '',
        date: formatDate(data.date) || new Date().toISOString(),
        tags: data.tags.split(',').map((tag: string) => tag.trim()) || [],
      } as BlogPostMetadata;
    });

    const posts = await Promise.all(postsPromises);

    // 按日期降序排序
    return posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA || 0; // 无效日期放最后
    });
  } catch (err) {
    console.error('读取博客目录失败:', err);
    return [];
  }
}

export async function getAllPostTags(): Promise<string[]> {
  const posts = await getAllPostMetadata();
  const tagSet = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export async function getPaginatedPosts(currentPage: number = 1) {
  const allPosts = await getAllPostMetadata();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const start = (validPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);

  // 智能页码
  const pageNumbers: number[] = [];
  const maxVisible = 5;
  let startPage = Math.max(1, validPage - 2);
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return {
    posts,
    totalPages,
    currentPage: validPage,
    pageNumbers,
    allPosts, // 用于标签计数
  };
}

// 可选：如果你首页还需要最新文章
export async function getLatestPosts(limit = 6): Promise<BlogPostMetadata[]> {
  const all = await getAllPostMetadata();
  if (limit <= 6) return all; // 返回全部
  return all.slice(0, limit);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr; // 无效日期原样返回
  }
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}