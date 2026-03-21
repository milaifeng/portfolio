import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="w-full border-t border-t-neutral-300 bg-white py-8 mt-12 flex justify-center dark:bg-neutral-900 dark:border-t-neutral-700 text-sm text-center gap-4">
        ©milaifeng.cn
        <Link href="https://beian.miit.gov.cn/" target="_blank">
          ICP备案号:<span className="text-blue-500"> 冀ICP备2026005449号</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
