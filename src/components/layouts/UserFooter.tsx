"use client";

import { Button } from "@/components/ui/button";
import {
  Facebook,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Globe,
  Heart,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const UserFooter = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine logo based on theme
  const logoSrc = mounted && (resolvedTheme === "dark" || theme === "dark")
    ? "/logo/logo-dark-removebg.png"
    : "/logo/logo-removebg.png";
  return (
    <footer className="py-8 lg:py-12 mx-auto px-2 lg:px-4 backdrop-blur-md bg-background/60 border-t border-border/40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 px-4 lg:px-20">
        {/* Logo và Social Links */}
        <div className="md:col-span-4 lg:col-span-3">
          <Link href="/" className="flex items-center mb-4 lg:mb-6">
            <Image
              src={logoSrc}
              width={180}
              height={80}
              alt="IT-Job Logo"
              className="object-contain"
            />
          </Link>

          <p className="text-muted-foreground/90 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
            Nền tảng kết nối nhân tài IT hàng đầu Việt Nam. Tạo cầu nối giữa các
            chuyên gia công nghệ và cơ hội nghề nghiệp tuyệt vời.
          </p>

          <div className="flex space-x-2 lg:space-x-3">
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer hover:bg-primary transition-colors group h-8 w-8 lg:h-10 lg:w-10"
            >
              <Github className="cursor-target h-3 w-3 lg:h-4 lg:w-4 group-hover:text-white" />
            </Button>
           <Button
              variant="outline"
              size="icon"
              className="cursor-pointer hover:bg-primary transition-colors group h-8 w-8 lg:h-10 lg:w-10"
            >
              <Facebook className="cursor-target h-3 w-3 lg:h-4 lg:w-4 group-hover:text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer hover:bg-primary transition-colors group h-8 w-8 lg:h-10 lg:w-10"
            >
              <Linkedin className="cursor-target h-3 w-3 lg:h-4 lg:w-4 group-hover:text-white" />
            </Button>
          </div>
        </div>

        {/* About Us Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-foreground/90 mb-3 lg:mb-4 text-sm lg:text-base">
            Về chúng tôi
          </h3>
          <ul className="space-y-2 lg:space-y-3">
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground/80 hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Giới thiệu
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Tầm nhìn
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Sứ mệnh
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Đội ngũ
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Tuyển dụng
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-foreground/90 mb-3 lg:mb-4 text-sm lg:text-base">Dịch vụ</h3>
          <ul className="space-y-2 lg:space-y-3">
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Tìm việc làm
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Đăng tin tuyển dụng
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Tư vấn nghề nghiệp
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Đánh giá kỹ năng
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Khóa học
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          </ul>
        </div>

        {/* For Employers Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-foreground/90 mb-3 lg:mb-4 text-sm lg:text-base">Dành cho nhà tuyển dụng</h3>
          <ul className="space-y-2 lg:space-y-3">
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Đăng tin tuyển dụng
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Giải pháp tuyển dụng
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Báo cáo thị trường IT
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group text-xs lg:text-sm"
              >
                Tạo tài khoản
                <ArrowRight className="cursor-target h-2 w-2 lg:h-3 lg:w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-foreground/90 mb-3 lg:mb-4 text-sm lg:text-base">Liên hệ</h3>
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center space-x-2 lg:space-x-3 text-muted-foreground/80">
              <Mail className="cursor-target h-3 w-3 lg:h-4 lg:w-4 text-primary flex-shrink-0" />
              <span className="text-xs lg:text-sm">contact@itjob.vn</span>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3 text-muted-foreground/80">
              <Phone className="cursor-target h-3 w-3 lg:h-4 lg:w-4 text-primary flex-shrink-0" />
              <span className="text-xs lg:text-sm">+84 123 456 789</span>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3 text-muted-foreground/80">
              <MapPin className="cursor-target h-3 w-3 lg:h-4 lg:w-4 text-primary flex-shrink-0" />
              <span className="text-xs lg:text-sm">Tp. Hồ Chí Minh, Việt Nam</span>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3 text-muted-foreground/80">
              <Globe className="cursor-target h-3 w-3 lg:h-4 lg:w-4 text-primary flex-shrink-0" />
              <span className="text-xs lg:text-sm">www.itjob.vn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-border/50 px-4 lg:px-20">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
          {/* Copyright - Stack on mobile */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-muted-foreground/70 text-center">
            <div className="flex items-center gap-1">
              <span className="text-xs lg:text-sm">© 2024 IT-Job Platform.</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs lg:text-sm">Được phát triển với</span>
              <Heart className="cursor-target h-3 w-3 lg:h-4 lg:w-4 text-destructive fill-current animate-pulse" />
              <span className="text-xs lg:text-sm">tại Việt Nam</span>
            </div>
          </div>

          {/* Links - Stack on mobile */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs lg:text-sm">
            <a
              href="#"
              className="cursor-target text-muted-foreground/70 hover:text-primary transition-colors whitespace-nowrap"
            >
              Điều khoản sử dụng
            </a>
            <a
              href="#"
              className="cursor-target text-muted-foreground/70 hover:text-primary transition-colors whitespace-nowrap"
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              className="cursor-target text-muted-foreground/70 hover:text-primary transition-colors whitespace-nowrap"
            >
              Cookie
            </a>
            <a
              href="#"
              className="cursor-target text-muted-foreground/70 hover:text-primary transition-colors whitespace-nowrap"
            >
              Trợ giúp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default UserFooter;
