import Link from "next/link";
type BlogsCardProps = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug?: string;
};

const BlogsCard = (props: BlogsCardProps) => {
  return (
    <Link
      href={`/blogs/${props.slug}`}
      className="relative block h-35 p-4 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:shadow-lg hover:border-[#B85CF6] transition-shadow duration-300 group"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md font-semibold group-hover:text-[#B85CF6]">
          {props.title}
        </h3>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {props.date}
        </span>
      </div>
      <p className="line-clamp-2 text-neutral-600 dark:text-neutral-400 my-2 text-sm">
        {props.description}
      </p>
      <div className="absolute bottom-2 flex gap-2 mt-2">
        {props.tags.map((tag) => (
          <span
            key={tag}
            className="text-blue-500 border-foreground rounded-full border px-2 py-1 text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default BlogsCard;
