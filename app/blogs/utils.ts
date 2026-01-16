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
export async function readDirFiles(
  dirPath: string
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
