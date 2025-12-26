import { Card, CardContent } from "@/components/ui/shadcn/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
// Type definition for KPICard props
interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
}

// KPICard component
function KPICard({ title, value, icon, trend, className }: KPICardProps) {
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
                <span className="text-muted-foreground ml-1">so với tuần trước</span>
              </div>
            )}
          </div>
          <div className="text-primary/60">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default KPICard;
