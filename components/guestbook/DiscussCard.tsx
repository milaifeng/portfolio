import Image from "next/image";
const DiscussCard = () => {
  return (
    <div className="flex w-2xl h-32 border bg-white border-neutral-300 rounded-lg dark:bg-white p-4">
      <Image
        src="/avatar/monkey1.jpg"
        alt="user"
        width={40}
        height={40}
        className="h-10 w-10 rounded-full"
      />
      <div className="flex flex-col py-2 px-4 gap-2 text-sm">
        <span className="text-neutral-500">匿名用户</span>
        <p className="dark:text-neutral-800">有没有源码和照片</p>
        <div className="flex text-neutral-400 gap-4">
          <span>2026-01-31 17:18</span>
          <button className="hover:text-blue-500 cursor-pointer">回复</button>
        </div>
      </div>
    </div>
  );
};

export default DiscussCard;
