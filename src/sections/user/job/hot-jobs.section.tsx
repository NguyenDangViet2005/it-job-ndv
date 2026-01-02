import Image from "next/image";
import { Briefcase, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/shadcn/card";

const HotJob = ({ props }: any) => {
  return (
    <div className="h-full">
      <Card className="rounded-lg transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 h-full group cursor-pointer border-0 shadow-lg hover:shadow-xl">
        {/* Cover Image Background - Full Card */}
        <div className="relative h-full flex flex-col">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image 
              src={props.coverImage || props.logo} 
              alt={props.company}
              fill
              className="object-cover"
            />
            {/* Purple/Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-800/50 to-blue-950/90"></div>
          </div>

          {/* Content Over Image - Fixed Structure */}
          <div className="relative h-full flex flex-col p-4">
            {/* Top: Logo - Fixed Height */}
            <div className="flex justify-center mb-3 flex-shrink-0">
              <div className="w-16 h-16 bg-white rounded-full p-2 flex items-center justify-center shadow-xl ring-2 ring-white/20">
                <Image 
                  src={props.logo} 
                  alt={props.company} 
                  width={48} 
                  height={48} 
                  className="object-contain"
                />
              </div>
            </div>

            {/* Company Name - Fixed Height */}
            <div className="flex-shrink-0 mb-2">
              <h3 className="font-bold text-sm text-white text-center line-clamp-1 drop-shadow-lg h-5">
                {props.company}
              </h3>
            </div>

            {/* Company Description - Fixed Height */}
            <div className="flex-shrink-0 mb-3">
              <p className="text-xs text-white/90 text-center line-clamp-2 drop-shadow h-8">
                {props.companyDescription || "Công ty hàng đầu trong lĩnh vực công nghệ"}
              </p>
            </div>

            {/* Job Position - Fixed Height */}
            <div className="flex-shrink-0 mb-3">
              <h2 className="font-bold text-base text-white text-center drop-shadow-lg line-clamp-2 h-12">
                {props.position}
              </h2>
            </div>

            {/* Spacer to push bottom content down */}
            <div className="flex-1"></div>

            {/* Bottom Section - Fixed at bottom */}
            <div className="space-y-2 flex-shrink-0">
              {/* Login to view salary */}
              <div className="text-center h-5">
                <p className="text-pink-400 font-semibold text-xs drop-shadow">
                  Login to view salary
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center justify-center gap-1.5 text-white h-5">
                <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                <p className="text-xs font-medium drop-shadow truncate">
                  {props.location || "TP. Hồ Chí Minh"}
                </p>
              </div>

              {/* VIP Company Badge */}
              <div className="flex justify-center h-7">
                <div className="bg-white rounded-lg px-3 py-1 shadow-lg flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-orange-500 font-bold text-xs">VIP Company</span>
                </div>
              </div>

              {/* Skills - Fixed Height */}
              <div className="flex gap-1.5 flex-wrap justify-center pt-1 min-h-[24px]">
                {props.skills && props.skills.length > 0 ? (
                  props.skills.slice(0, 3).map((s: any, i: any) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 font-medium"
                    >
                      {s}
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
