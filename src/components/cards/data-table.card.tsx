"use client";

import * as React from "react";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Input } from "@/components/ui/shadcn/input";

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface ActionItem {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchKey?: keyof T;
  filterKey?: keyof T;
  filterOptions?: { value: string; label: string }[];
  onRowAction?: (action: string, row: T) => void;
  actions?: ActionItem[];
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchKey,
  filterKey,
  filterOptions,
  onRowAction,
  actions,
  className,
}: DataTableProps<T>) {
  // Default actions if not provided
  const defaultActions: ActionItem[] = [
    { key: "accept", label: "Chấp Nhận", className: "text-green-600" },
    { key: "reject", label: "Từ Chối", className: "text-red-600" },
    { key: "email", label: "Gửi Email", className: "text-blue-600" },
    { key: "delete", label: "Xóa", className: "text-destructive" },
  ];

  const menuActions = actions || defaultActions;
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const filteredData = React.useMemo(() => {
    let result = [...data];

    if (search && searchKey) {
      result = result.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== "all" && filterKey) {
      result = result.filter((item) => item[filterKey] === filter);
    }

    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return result;
  }, [data, search, filter, sortBy, sortOrder, searchKey, filterKey]);

  const handleSort = (column: keyof T) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg font-mono">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {searchKey && (
            <Input
              placeholder={`Search by ${String(searchKey)}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 font-mono text-sm"
            />
          )}
          {filterKey && filterOptions && (
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px] font-mono">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-b">
              {columns.map((column, index) => (
                <div
                  key={String(column.key)}
                  className={`p-3 text-sm font-semibold font-mono text-foreground ${
                    index === columns.length - 1 ? "col-span-1" : "col-span-2"
                  }`}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-mono hover:bg-transparent"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  ) : (
                    column.header
                  )}
                </div>
              ))}
              <div className="col-span-1 p-3"></div>
            </div>

            {/* Table Body */}
            {filteredData.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-mono">
                No data found
              </div>
            ) : (
              filteredData.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-12 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <div
                      key={String(column.key)}
                      className={`p-3 text-sm ${
                        colIndex === columns.length - 1
                          ? "col-span-1"
                          : "col-span-2"
                      }`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key])}
                    </div>
                  ))}
                  <div className="col-span-1 p-3">
                    {onRowAction && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="font-mono">
                          {menuActions.map((action) => (
                            <DropdownMenuItem
                              key={action.key}
                              onClick={() => onRowAction(action.key, row)}
                              className={action.className}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-mono">
              No data found
            </div>
          ) : (
            filteredData.map((row, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  {columns.slice(0, -1).map((column) => (
                    <div
                      key={String(column.key)}
                      className="flex justify-between"
                    >
                      <span className="text-sm font-mono text-muted-foreground">
                        {column.header}:
                      </span>
                      <span className="text-sm font-medium">
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key])}
                      </span>
                    </div>
                  ))}
                  {onRowAction && (
                    <div className="pt-2 border-t">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full font-mono"
                          >
                            Actions
                            <MoreHorizontal className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full font-mono">
                          {menuActions.map((action) => (
                            <DropdownMenuItem
                              key={action.key}
                              onClick={() => onRowAction(action.key, row)}
                              className={`${action.className}  `}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
