export const revalidate = 3600; //1小时

import Terminal from "@/components/home/Terminal";
import InfoCard from "@/components/home/InfoCard";
import BlogsCard from "@/components/home/blogsCard";
import { getLatestPosts } from "@/app/blogs/utils";
export default async function Home() {
  const blogPosts = await getLatestPosts(6);
  return (
    <>
      <section className="flex py-12 justify-between">
        <Terminal />
        <InfoCard />
      </section>
      <div className="border-t border-neutral-300 dark:border-neutral-700 p-4 mb-12">
        <h2 className="my-8 text-2xl font-semibold">最新文章</h2>
        <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogsCard
              key={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              tags={post.tags}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </>
  );
}
