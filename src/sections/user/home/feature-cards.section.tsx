"use client";

import { Card, CardContent } from "@/components/ui/shadcn/card";
import {
  ArrowRight,
  Briefcase,
  Building2,
  GraduationCap,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Việc làm IT",
    desc: "Hàng nghìn cơ hội việc làm IT hấp dẫn",
    link: "Tìm việc ngay",
    href: '/jobs',
    icon: <Briefcase className="w-7 h-7 text-primary" />,
  },
  {
    title: "Top Công ty",
    desc: "Khám phá các công ty IT hàng đầu Việt Nam",
    link: "Xem ngay",
    href: '/companies',
    icon: (
      <div className="relative">
        <Building2 className="w-7 h-7 text-primary" />
        <span className="absolute -top-2 left-5 bg-destructive text-destructive-foreground text-[7px] font-bold px-2 py-0.5 rounded-full">
          HOT
        </span>
      </div>
    ),
  },
  {
    title: "Việc làm Fresher",
    desc: "Đa dạng cơ hội việc làm IT cho Fresher",
    link: "Khám phá",
    href: '/jobs',
    icon: <GraduationCap className="w-7 h-7 text-primary" />,
  },
  {
    title: "Câu hỏi phỏng vấn",
    desc: "Sẵn sàng cho buổi phỏng vấn của bạn",
    link: "Xem thêm",
    href: '/blog',
    icon: <MessageSquare className="w-7 h-7 text-primary" />,
  },
  {
    title: "Xu hướng IT",
    desc: "Cập nhật xu hướng công nghệ và mức lương",
    link: "Tìm hiểu",
    href: '/QA',
    icon: <TrendingUp className="w-7 h-7 text-primary" />,
  },
];

export default function FeatureCards(props?: any) {
  return (
    <Card className="w-full max-w-7xl mx-auto shadow-md rounded-2xl text-sm">
      <CardContent className="p-6 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3 cursor-target">
              <div>{item.icon}</div>
              <h3 className="text-[15px] font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm flex-1">{item.desc}</p>
              <Link
                href={item.href}
                className="text-primary font-semibold inline-flex items-center gap-1 hover:underline"
              >
                {item.link} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
