"use client";

import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center bg-input shadow-lg rounded-lg overflow-hidden gap-3 sm:gap-0 p-3 sm:p-0">
        {/* Ô input */}
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm theo các Kỹ năng, Vị trí, Công ty..."
          className="flex-1 h-10 sm:h-14 text-base sm:text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 sm:px-6"
        />

        {/* Nút tìm kiếm */}
        <Button
          type="submit"
          disabled={!keyword.trim()}
          className="h-10 sm:h-14 w-full sm:w-auto bg-red-600 hover:bg-red-800 text-white font-semibold rounded-lg sm:rounded-none px-6 sm:px-10 text-base sm:text-lg flex items-center justify-center gap-2 disabled:bg-white disabled:text-red-500"
        >
          <Search size={15} />
          <span>Tìm kiếm</span>
        </Button>
      </div>
    </form>
  );
}
