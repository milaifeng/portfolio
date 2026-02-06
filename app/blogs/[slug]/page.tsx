import { getLatestPosts } from "@/app/blogs/utils";
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
  const { slug } = await params;
  const post = await import(`@/contents/blogs/${slug}.mdx`);
  const MDXContent = post.default;

  const metadata: BlogPostMetadata = post.metadata;
  const title = metadata.title;
  const date = new Date(metadata.date);
  const tags = metadata.tags;
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <article className="w-full prose p-6">
          <div className="mt-6 mb-8">
            <h1 className="mb-2 text-4xl font-bold">{title}</h1>
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm">{formattedDate}</span>|
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
          <MDXContent />
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const post = await getLatestPosts();
  const slug = post.map((item) => {
    return { slug: item.slug };
  });
  return slug;
}

export const dynamicParams = false;
