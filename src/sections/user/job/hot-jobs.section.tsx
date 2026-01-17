import Image from "next/image";
import { Briefcase, TrendingUp, MoveRight } from "lucide-react";
import { Card } from "@/components/ui/shadcn/card";
import { useAuth } from "@/hooks/useAuth"; 

const HotJob = ({ props }: JobResponse) => {
  const { user } = useAuth();
  return (
    <div className="h-full">
      <Card className="transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 h-full group cursor-pointer border-0 rounded-none p-0">
        <div className="relative h-full flex flex-col">
          <div className="inset-0">
            <Image
              src={props.company.coverImage || props.logo || "/cover.png"}
              alt={props.company.name || "Company"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-800/50 to-blue-950/90"></div>
          </div>
          <div className="relative h-full flex flex-col p-4">
            <div className="flex justify-center mb-3 flex-shrink-0">
              <div className="relative w-16 h-16 bg-white rounded-full p-1.5 flex items-center justify-center shadow-xl ring-2 ring-white/20">
                <Image
                  src={props.company.avatar || "/logo.png"}
                  alt={props.company.name || "Company"}
                  width={56}
                  height={56}
                  className="object-cover rounded-full"
                />
              </div>
            </div>
            <div className="flex-shrink-0 mb-2">
              <h3 className="font-bold text-sm text-white text-center line-clamp-1 drop-shadow-lg h-5">
                {props.company.name}
              </h3>
            </div>
            <div className="flex-shrink-0 mb-3">
              <p className="text-xs text-white/90 text-center line-clamp-2 drop-shadow h-8">
                {props.company.description ||
                  "Công ty hàng đầu trong lĩnh vực công nghệ"}
              </p>
            </div>
            <div className="flex-shrink-0 mb-3">
              <h2 className="font-bold text-base text-white text-center drop-shadow-lg line-clamp-2 h-12">
                {props.title}
              </h2>
            </div>
            <div className="flex-1"></div>
            <div className="space-y-2 flex-shrink-0">
              <div className="text-center h-5 flex items-center justify-center gap-1">
                <p className="text-pink-400 font-semibold text-xs drop-shadow">
                  {user ? "Xem chi tiết lương" : "Đăng nhập để xem chi tiết lương"}
                </p>
                <MoveRight className="w-3.5 h-3.5 flex-shrink-0 text-pink-400"/>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-white h-5">
                <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                <p className="text-xs font-medium drop-shadow truncate">
                  {props.address || "TP. Hồ Chí Minh"}
                </p>
              </div>
              <div className="flex justify-center h-7">
                <div className="bg-white rounded-lg px-3 py-1 shadow-lg flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-orange-500 font-bold text-xs">
                    VIP Company
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-center pt-1 min-h-[24px]">
                {props.skills && props.skills.length > 0 ? (
                  props.skills.slice(0, 3).map((s: any, i: any) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 font-medium"
                    >
                      {s.name}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 font-medium">
                    IT
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default HotJob;
