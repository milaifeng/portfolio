import { Loader2 } from "lucide-react";
const Loading = () => {
  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center bg-white/70 z-100">
      <Loader2 width={50} className="animate-spin text-2xl text-blue-500" />
    </div>
  );
};

export default Loading;
