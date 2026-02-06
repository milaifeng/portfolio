import Link from "next/link";
import { getAllPostTags, getPaginatedPosts } from "./utils";
import BlogsCard from "@/components/home/blogsCard";
const BlogPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const {
    posts,
    totalPages,
    currentPage: validPage,
    pageNumbers,
    allPosts,
  } = await getPaginatedPosts(currentPage);
  const tagSet = await getAllPostTags();
  return (
    <div className="flex justify-between min-h-screen pt-12 px-4 gap-8">
      <div className="flex flex-col flex-1">
        <div className="grid grid-cols-2 gap-4">
          {posts.map((post) => (
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
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link
              href={`/blogs?page=${validPage - 1}`}
              className={`px-4 py-2 rounded-lg ${validPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            >
              上一页
            </Link>

            {pageNumbers.map((page) => (
              <Link
                key={page}
                href={`/blogs?page=${page}`}
                className={`px-4 py-2 rounded-lg ${page === validPage ? "bg-blue-600 text-white" : "dark:bg-white bg-gray-300 text-blue-500"}`}
              >
                {page}
              </Link>
            ))}

            <Link
              href={`/blogs?page=${validPage + 1}`}
              className={`px-4 py-2 rounded-lg ${validPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            >
              下一页
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-col max-w-xs w-full shrink-0 sticky top-18 self-start">
        <h2 className="text-xl font-semibold pb-5 mb-5 border-b border-gray-300">
          分类
        </h2>
        {tagSet.map((tag) => (
          <span
            key={tag}
            className="w-full flex items-center justify-between h-15 px-3 py-2 mb-3 bg-linear-to-r from-indigo-500/80 to-purple-500/80 rounded-lg text-white cursor-pointer hover:opacity-80 transition"
          >
            {tag}
            <span className="bg-white text-gray-800 text-center leading-7 text-sm font-medium h-7 w-7 rounded-full">
              {allPosts.filter((post) => post.tags.includes(tag)).length}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
