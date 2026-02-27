export const revalidate = 60 * 60 * 24;
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Back from '@/components/blog/Back';
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug:encodeSlug } = await params;
  const slug = decodeURIComponent(encodeSlug);

  const filePath = path.join(process.cwd(), 'contents', 'blogs', `${slug}.mdx`);

  let source: string;
  try {
    source = await fs.readFile(filePath, 'utf-8');
  } catch {
    return {
      title: '文章未找到',
      description: '抱歉，该文章不存在或已被删除。',
    };
  }

  const { data } = matter(source);

  // 提取 frontmatter（可加默认值）
  const title = (data.title as string) || '无标题';
  const description = (data.description as string) || '米莱峰前端技术分析博客';

  return {
    title: `${title} `,           // 文章标题 + 站点名（SEO 友好）
    description,
    openGraph: {
      title: `${title}`,
      description,
      type: 'article',
      publishedTime: data.date as string | undefined,
      url: `https://your-domain.com/blogs/${slug}`,  // 替换成你的真实域名
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title}`,
      description,
    },
  };
}

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

type BlogPostMetadata = {
  title: string;
  description: string;
  date: string;
  tags: string[];
};

export default async function BlogPage({ params }: BlogPageProps) {
 const { slug:encodeSlug } = await params;

  const slug = decodeURIComponent(encodeSlug);

  const filePath = path.join(process.cwd(), 'contents', 'blogs', `${slug}.mdx`);
  let source: string;
  try {
    source = await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    notFound();
  }
  // 解析 frontmatter 和内容
  const { content, data } = matter(source);
  // 类型断言（你可以加更严格的校验）
  const metadata = data as Partial<BlogPostMetadata>;

  const title = metadata.title || '无标题';
  const dateRaw = metadata.date ? new Date(metadata.date) : new Date();
  const description = metadata.description || "简介"
  const tags = data.tags.split(',').map((tag: string) => tag.trim()) as string[] || [];

  const formattedDate = new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateRaw);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <article className="w-full prose dark:prose-invert p-6">
          <Back />
          <div className="mt-6 mb-8">
            <h1 className="mb-2 text-4xl font-bold dark:text-blue-500">{title}</h1>
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm">{formattedDate}</span> |
              <div className="flex gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-blue-500 border-foreground rounded-full border px-2 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <MDXRemote
            source={content}
            // 可选：如果你在 MDX 中用了自定义组件，可以在这里传入
            // components={{ YourCustomComponent }}
          />
        </article>
      </div>
    </div>
  );
}