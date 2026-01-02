import HrKPICard from "@/components/cards/hr.kpi.card";
import { Briefcase, Users, Calendar, FileText } from "lucide-react";

const kpiData = [
  {
    title: "Vị trí đang tuyển",
    value: 24,
    trend: 12,
  },
  {
    title: "Ứng viên mới",
    value: 156,
    trend: 8,
  },
  {
    title: "Phỏng vấn hôm nay",
    value: 7,
  },
  {
    title: "Số đơn ứng tuyển",
    value: 342,
    trend: 15,
  },
];

// KPI component
const KPI = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <HrKPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          trend={kpi.trend}
        />
      ))}
    </div>
  );
};

export default KPI;
