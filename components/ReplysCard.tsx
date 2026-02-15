import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import Image from "next/image";

interface Comment {
  id: number;
  content: string;
  username: string;
  userId: number | null;
  avatar: string;
  createdAt: string;
  replies?: Comment[];
}

interface replysProps {
  comment: Comment;
  userId?: number | null;
  onReply: () => void;
}
const ReplysCard = ({ comment, userId, onReply }: replysProps) => {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: zhCN,
  });
  return (
    <div className="gap-8 flex-col w-full mt-2">
      <div className="flex  gap-2">
        <Image
          src={comment.avatar}
          alt="user"
          width={40}
          height={40}
          className="h-8 w-8 rounded-full shrink-0"
        />
        <p className="dark:text-neutral-800 p-1 flex-1 text-sm whitespace-pre-wrap wrap-break-words">
          <span className="text-xs mr-3 text-neutral-500">
            {comment.username}
          </span>
          {comment.content}
        </p>
      </div>
      <div className="flex px-11 mt-1 text-neutral-400  gap-4 text-xs">
        <span className="text-neutral-400 ">{timeAgo}</span>
        {comment.userId === userId ? null : (
          <button
            onClick={onReply}
            className="hover:text-blue-500 cursor-pointer transition"
          >
            回复
          </button>
        )}
      </div>
    </div>
  );
};

export default ReplysCard;
