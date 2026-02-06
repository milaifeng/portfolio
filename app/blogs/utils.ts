import fs from "fs";
import path from "path";
type BlogPostMetadata = {
  slug?: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
};
export const BLOGS_PATH = path.join(process.cwd(), "contents", "blogs");
const POSTS_PER_PAGE = 10;
export async function readDirFiles(
  dirPath: string,
): Promise<BlogPostMetadata[]> {
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    const blogPosts = files.map(async (file) => {
      const fileName = file.name;
      const post = await import(`@/contents/blogs/${fileName}`);
      const metadata: BlogPostMetadata = post.metadata;
      return {
        ...metadata,
        slug: fileName.split(".")[0],
      };
    });
    const blogPostsPromises = await Promise.all(blogPosts);
    return blogPostsPromises;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

let allPosts: BlogPostMetadata[] = [];
let sortedPosts: BlogPostMetadata[] = [];

export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  if (sortedPosts.length > 0) return sortedPosts;

  allPosts = await readDirFiles(BLOGS_PATH);

  // 按 date 降序排序（最新在前）
  sortedPosts = [...allPosts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    // 如果日期无效，放到最后
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateB - dateA;
  });

  return sortedPosts;
}

// 首页：最新 6 篇
export async function getLatestPosts(limit = 6): Promise<BlogPostMetadata[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

// 博客列表页：全部按时间排序
export async function getAllSortedPosts(): Promise<BlogPostMetadata[]> {
  return await getAllPosts();
}

export async function getAllPostTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet: Set<string> = new Set();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagSet.add(tag);
    });
  });
  return Array.from(tagSet);
}

export async function getPaginatedPosts(currentPage: number = 1) {
  const allPosts = await getAllSortedPosts(); // 全量博客
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // 修正非法页码
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (validPage - 1) * POSTS_PER_PAGE;
  const postsForPage = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // 生成页码数组（智能显示）
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, validPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return {
    posts: postsForPage,
    totalPages,
    currentPage: validPage,
    pageNumbers: getPageNumbers(),
    allPosts, // 如果分类需要全量计数
  };
}
