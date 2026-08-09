"use client";

import * as React from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="border border-primary cursor-target"
      >
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Đổi giao diện</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-target flex items-center gap-2"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Sáng</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-target flex items-center gap-2"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4 text-indigo-400" />
          <span>Tối</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-target flex items-center gap-2"
          onClick={() => setTheme("system")}
        >
          <Laptop className="h-4 w-4 text-slate-500" />
          <span>Theo hệ thống</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
