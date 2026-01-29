type OverlayProps = {
  isActive: boolean;
  onSignUpClick: () => void;
  onSignInClick: () => void;
};
const Overlay = ({ isActive, onSignUpClick, onSignInClick }: OverlayProps) => {
  return (
    <div
      className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-transform duration-600 ease-in-out z-30
       ${isActive ? "-translate-x-full" : "translate-x-0"}`}
    >
      <div
        className={`relative -left-full flex h-full w-[200%] bg-blue-500  transition-transform duration-600 ease-in-out
          ${isActive ? "translate-x-[50%]" : "translate-x-0"}`}
      >
        <div
          className={`absolute inset-0 w-1/2 gap-4 flex flex-col items-center justify-center px-12 text-center text-white transition-transform duration-600 ease-in-out
          ${isActive ? "translate-x-0" : "translate-x-0"}`}
        >
          <h1 className="text-xl font-bold">已有账号？</h1>
          <p className="text-sm">直接登录继续使用</p>
          <button
            className="bg-blue-500 text-white px-6 py-2 border border-white rounded-xl cursor-pointer"
            onClick={onSignInClick}
          >
            登录
          </button>
        </div>
        <div
          className={`absolute inset-0 right-0 w-1/2 flex flex-col items-center justify-center gap-4 px-12 text-center text-white transition-transform duration-600 ease-in-out
          ${isActive ? "translate-x-[50%] opacity-0" : "translate-x-full"}`}
        >
          <h1 className="text-xl font-bold">没有账号？</h1>
          <p className="text-sm">立即注册加入我们</p>
          <button
            className="bg-blue-500 text-white px-6 py-2 border border-white rounded-xl cursor-pointer"
            onClick={onSignUpClick}
          >
            注册
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
