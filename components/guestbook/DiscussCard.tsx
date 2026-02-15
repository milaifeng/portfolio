import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import ReplysCard from "../ReplysCard";

interface Comment {
  id: number;
  content: string;
  username: string;
  userId: number | null;
  avatar: string;
  createdAt: string;
  replies?: Comment[];
}

interface DiscussCardProps {
  comment: Comment;
  userId?: number | null;
  onReply: (id: number) => void;
}

const DiscussCard = ({ comment, userId, onReply }: DiscussCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <>
      <div className="flex w-full border bg-white border-neutral-300 rounded-lg p-4">
        <Image
          src={comment.avatar}
          alt="user"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full shrink-0"
        />
        <div className="flex flex-col py-2 px-4 gap-2 text-sm flex-1">
          <div className="flex items-center gap-4">
            <span className="text-neutral-700 text-xs font-medium">
              {comment.username}
            </span>
          </div>
          <p className="dark:text-neutral-800 text-sm whitespace-pre-wrap wrap-break-words">
            {comment.content}
          </p>

          <div className="flex text-neutral-400 gap-4 text-xs">
            <span className="text-neutral-400 ">{timeAgo}</span>
            {comment.userId === userId ? null : (
              <button
                onClick={() => onReply(comment.id)}
                className="hover:text-blue-500 cursor-pointer transition"
              >
                回复
              </button>
            )}
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <>
              {comment.replies.map((reply) => (
                <ReplysCard
                  key={reply.id}
                  comment={reply}
                  userId={userId}
                  onReply={() => onReply(comment.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DiscussCard;
