import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
const SearchButton = () => {
  return (
    <Button className="w-25 justify-start gap-4 border border-gray-500 rounded-3xl text-gray-500">
      <Search />
      <span>搜索</span>
    </Button>
  );
};

export default SearchButton;
