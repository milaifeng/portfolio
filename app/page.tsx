import Terminal from "@/components/home/Terminal";
import InfoCard from "@/components/home/InfoCard";

export default function Home() {
  return (
    <div>
      <div className="flex py-12 justify-between">
        <Terminal />
        <InfoCard />
      </div>
      <div>最新博客</div>
      <div>最新项目</div>
    </div>
  );
}
