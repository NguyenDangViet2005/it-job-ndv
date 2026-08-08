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
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col sm:flex-row items-center bg-card/90 backdrop-blur-xl border border-border/60 shadow-xl shadow-primary/5 rounded-2xl p-2 sm:p-2.5 gap-2 transition-all hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
        <div className="flex items-center flex-1 w-full px-3 gap-2 text-muted-foreground">
          <Search size={20} className="text-primary shrink-0" />
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Kỹ năng, vị trí công việc, tên công ty..."
            className="w-full h-11 text-sm sm:text-base border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-1 placeholder:text-muted-foreground/70"
          />
        </div>

        <Button
          type="submit"
          disabled={!keyword.trim()}
          className="h-11 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-6 lg:px-8 text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all shrink-0"
        >
          <span>Tìm kiếm</span>
        </Button>
      </div>
    </form>
  );
}
