"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";

interface JobFilterSidebarProps {
  skills: Array<{ id: number; name: string }>;
  selectedSkill: number | null;
  onSkillChange: (skillid: number | null) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  jobTypes?: string[];
  selectedJobType?: string | null;
  onJobTypeChange?: (type: string | null) => void;
}

export default function JobFilterSidebar({
  skills,
  selectedSkill,
  onSkillChange,
  searchTerm,
  onSearchChange,
  jobTypes = ["Full-time", "Part-time", "Remote", "Internship"],
  selectedJobType,
  onJobTypeChange,
}: JobFilterSidebarProps) {
  const handleClearFilters = () => {
    onSkillChange(null);
    onSearchChange("");
    onJobTypeChange?.(null);
  };

  const hasActiveFilters =
    selectedSkill !== null || searchTerm !== "" || selectedJobType !== null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Filter className="h-4 w-4 text-primary" />
            Bộ lọc
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 pt-0">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Từ khóa..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>

        {/* Job Type Filter */}
        {onJobTypeChange && (
          <div className="space-y-2 pb-4 border-b">
            <label className="text-xs font-medium text-muted-foreground">
              Loại hình
            </label>
            <div className="flex flex-wrap gap-1.5">
              {jobTypes?.map((type) => (
                <Badge
                  key={type}
                  variant={selectedJobType === type ? "default" : "outline"}
                  className={`cursor-pointer px-2.5 py-1 text-xs transition-all ${
                    selectedJobType === type
                      ? " hover:text-foreground"
                      : "hover:bg-primary hover:text-foreground"
                  }`}
                  onClick={() =>
                    onJobTypeChange(selectedJobType === type ? null : type)
                  }
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Kỹ năng
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-[240px] overflow-y-auto p-1">
            <Badge
              variant={selectedSkill === null ? "default" : "outline"}
              className={`cursor-pointer px-2.5 py-1 text-xs transition-all ${
                selectedSkill === null
                  ? "hover:bg-primary hover:text-foreground"
                  : "hover:bg-primary hover:text-foreground"
              }`}
              onClick={() => onSkillChange(null)}
            >
              Tất cả
            </Badge>
            {skills?.map((skill) => (
              <Badge
                key={skill.id}
                variant={selectedSkill === skill.id ? "default" : "outline"}
                className={`cursor-pointer px-2.5 py-1 text-xs transition-all ${
                  selectedSkill === skill.id
                    ? "hover:bg-primary hover:text-foreground"
                    : "hover:bg-primary hover:text-foreground"
                }`}
                onClick={() => onSkillChange(skill.id)}
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Đang lọc (
              {
                [selectedSkill !== null, selectedJobType, searchTerm].filter(
                  Boolean
                ).length
              }
              )
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedSkill !== null && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs px-2 py-0.5 bg-primary text-foreground"
                >
                  {skills?.find((s) => s.id === selectedSkill)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-600"
                    onClick={() => onSkillChange(null)}
                  />
                </Badge>
              )}
              {selectedJobType && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs px-2 py-0.5 bg-primary text-foreground"
                >
                  {selectedJobType}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-600"
                    onClick={() => onJobTypeChange?.(null)}
                  />
                </Badge>
              )}
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs px-2 py-0.5 bg-primary text-foreground"
                >
                  "{searchTerm}"
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-600"
                    onClick={() => onSearchChange("")}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
