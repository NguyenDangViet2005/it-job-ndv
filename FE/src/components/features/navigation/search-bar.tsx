"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <form onSubmit={handleSearch} className="w-full mx-auto px-2 lg:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center bg-card dark:bg-muted shadow-lg rounded-lg overflow-hidden gap-2 sm:gap-0 p-2 sm:p-0 border border-border/50">
        {/* Ô input */}
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm theo các Kỹ năng, Vị trí, Công ty..."
          className="flex-1 h-9 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 sm:px-4 lg:px-6"
        />

        {/* Nút tìm kiếm */}
        <Button
          type="submit"
          disabled={!keyword.trim()}
          className="h-9 sm:h-12 lg:h-14 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-primary-foreground font-semibold rounded-lg sm:rounded-none px-4 sm:px-8 lg:px-10 text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 disabled:bg-gray-500"
        >
          <Search size={14} className="sm:w-4 sm:h-4" />
          <span>Tìm kiếm</span>
        </Button>
      </div>
    </form>
  );
}
