import { Card, CardContent } from "@/components/ui/shadcn/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
// Type definition for KPICard props
interface KPICardProps {
  title: string;
  value: number;
  trend?: number;
  className?: string;
}

// KPICard component
function HrKPICard({ title, value, trend, className }: KPICardProps) {
  return (
    <Card className={cn(className, "cursor-target hover:shadow-lg transition-shadow")}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold font-mono">{value}</p>
            {trend && (
              <div className="flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500 font-mono">+{trend}%</span>
                <span className="text-muted-foreground ml-1">vs last week</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default HrKPICard;
