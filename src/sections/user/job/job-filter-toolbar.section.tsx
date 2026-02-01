"use client";

import React from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/shadcn/dropdown-menu";
import { Search, X, Briefcase, Code2, Eraser, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobFilterToolbarProps {
  skills: Array<{ id: number; name: string }>;
  selectedSkill: number | null;
  onSkillChange: (skillid: number | null) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  jobTypes?: string[];
  selectedJobType?: string | null;
  onJobTypeChange?: (type: string | null) => void;
}

export default function JobFilterToolbar({
  skills,
  selectedSkill,
  onSkillChange,
  searchTerm,
  onSearchChange,
  jobTypes = ["Full-time", "Part-time", "Remote", "Internship"],
  selectedJobType,
  onJobTypeChange,
}: JobFilterToolbarProps) {
  const hasActiveFilters = selectedSkill !== null || searchTerm !== "" || selectedJobType !== null;

  return (
    <div className="bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border p-2 mb-10">
      <div className="flex flex-col lg:flex-row items-center gap-2">
        {/* Keyword Search */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <Input
            placeholder="Vị trí tuyển dụng, kỹ năng hoặc công ty..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-14 bg-transparent border-none focus-visible:ring-0 text-base font-medium placeholder:text-gray-400"
          />
          {searchTerm && (
            <button 
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-border rounded-full transition-colors"
            >
                <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="hidden lg:block w-[1px] h-8 bg-border mx-1" />

        {/* Job Type Dropdown */}
        <div className="w-full lg:w-56 px-2">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="w-full h-14 justify-between px-4 hover:bg-accent focus:bg-accent rounded-none border-none shadow-none text-base font-medium"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <Briefcase className="h-4 w-4 text-primary/60 shrink-0" />
                            <span className="truncate">
                                {selectedJobType || "Loại hình"}
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-none p-1 border-border shadow-xl z-[100]" align="start">
                    <DropdownMenuRadioGroup 
                        value={selectedJobType || "all"} 
                        onValueChange={(val) => onJobTypeChange?.(val === "all" ? null : val)}
                    >
                        <DropdownMenuRadioItem value="all" className="rounded-none cursor-target">
                            Tất cả loại hình
                        </DropdownMenuRadioItem>
                        {jobTypes.map((type) => (
                            <DropdownMenuRadioItem key={type} value={type} className="rounded-none cursor-target">
                                {type}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="hidden lg:block w-[1px] h-8 bg-border mx-1" />

        {/* Skills Dropdown */}
        <div className="w-full lg:w-64 px-2">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="w-full h-14 justify-between px-4 hover:bg-accent focus:bg-accent rounded-none border-none shadow-none text-base font-medium"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <Code2 className="h-4 w-4 text-primary/60 shrink-0" />
                            <span className="truncate">
                                {skills.find(s => s.id === selectedSkill)?.name || "Kỹ năng chính"}
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-none p-1 border-border shadow-xl max-h-[300px] overflow-y-auto z-[100]" align="start">
                    <DropdownMenuRadioGroup 
                        value={selectedSkill?.toString() || "all"} 
                        onValueChange={(val) => onSkillChange(val === "all" ? null : parseInt(val))}
                    >
                        <DropdownMenuRadioItem value="all" className="rounded-none cursor-target">
                            Tất cả kỹ năng
                        </DropdownMenuRadioItem>
                        {skills.map((skill) => (
                            <DropdownMenuRadioItem key={skill.id} value={skill.id.toString()} className="rounded-none cursor-target">
                                {skill.name}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
            <div className="px-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none text-red-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => {
                        onSkillChange(null);
                        onSearchChange("");
                        onJobTypeChange?.(null);
                    }}
                    title="Xóa tất cả bộ lọc"
                >
                    <Eraser className="h-5 w-5" />
                </Button>
            </div>
        )}

        {/* Search Button */}
        <div className="w-full lg:w-auto">
             <Button className="h-12 px-5 w-full font-semibold hover:scale-105 transition-all rounded-none">
                Tìm kiếm
             </Button>
        </div>
      </div>
    </div>
  );
}
