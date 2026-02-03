import KPI from "@/components/features/hr/kpi.section";
import QuickActions from "@/components/common/cards/hrCards/quick.action.card";
import ActivityFeed from "@/components/common/cards/adminCards/activity-feed.card";

const HRDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-mono">Bảng Điều Khiển HR</h1>
        <p className="text-muted-foreground">
          Tổng quan về hoạt động tuyển dụng và các chỉ số
        </p>
      </div>

      <KPI />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
export default HRDashboard;
