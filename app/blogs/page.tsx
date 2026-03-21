export const revalidate = 3600;

import Link from "next/link";
import BlogsCard from "@/components/home/blogsCard";
import { getPaginatedPosts, getAllPostTags } from "./utils";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
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
    <div className="flex flex-col md:flex-row justify-between min-h-screen pt-12 px-4 md:px-6 gap-6 md:gap-8">
      <div className="flex flex-col flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8 sm:mt-10 px-4">
            <Link
              href={`/blogs?page=${validPage - 1}`}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                validPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              上一页
            </Link>

            {pageNumbers.map((p) => (
              <Link
                key={p}
                href={`/blogs?page=${p}`}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                  p === validPage
                    ? "bg-gray-300/50 text-blue-500"
                    : "dark:bg-white bg-blue-500 text-white"
                }`}
              >
                {p}
              </Link>
            ))}

            <Link
              href={`/blogs?page=${validPage + 1}`}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                validPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              下一页
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col max-w-50 w-full shrink-0 sticky top-18 self-start mt-6 md:mt-0">
        <h2 className="text-lg sm:text-xl font-semibold pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-gray-300">
          分类
        </h2>
        {tagSet.map((tag) => (
          <span
            key={tag}
            className="w-full flex items-center justify-between h-14 sm:h-15 px-3 py-2 mb-2 sm:mb-3 bg-linear-to-r from-indigo-500/80 to-purple-500/80 rounded-lg text-white cursor-pointer hover:opacity-80 transition"
          >
            {tag}
            <span className="bg-white text-gray-800 text-center leading-7 text-xs sm:text-sm font-medium h-7 w-7 rounded-full">
              {allPosts.filter((post) => post.tags.includes(tag)).length}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
