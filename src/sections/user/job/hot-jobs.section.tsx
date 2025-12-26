import Image from "next/image";
import { Briefcase, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/shadcn/card";

const HotJob = ({ props }: any) => {
  return (
    <div className="h-full">
      <Card className="border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300 p-5 flex flex-col items-center bg-white dark:bg-gray-800 h-full group cursor-pointer">
        {/* Hot Badge */}
        <div className="w-full flex justify-end mb-2">
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            HOT
          </span>
        </div>

        {/* Company Logo */}
        <div className="w-24 h-24 relative mb-4 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600 p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Image 
            src={props.logo} 
            alt={props.company} 
            width={80} 
            height={80} 
            className="object-contain"
          />
        </div>

        {/* Job Position */}
        <h3 className="font-bold text-center text-base mb-2 line-clamp-2 min-h-[3rem] text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {props.position}
        </h3>

        {/* Company Name */}
        <div className="flex items-center gap-1.5 mb-4">
          <Briefcase className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {props.company}
          </p>
        </div>

        {/* Skills */}
        <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center font-medium">Kỹ năng yêu cầu:</p>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {props.skills.slice(0, 3).map((s: any, i: any) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-md bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700 font-medium"
              >
                {s}
              </span>
            ))}
            {props.skills.length > 3 && (
              <span className="px-3 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                +{props.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Apply Button */}
        <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors duration-200 opacity-0 group-hover:opacity-100">
          Xem chi tiết
        </button>
      </Card>
    </div>
  );
};
export default HotJob;
