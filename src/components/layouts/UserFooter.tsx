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
    <footer className="py-12 mx-auto px-4 backdrop-blur-md bg-background/60 border-t border-border/40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 px-20">
        {/* Logo và Social Links */}
        <div className="md:col-span-4 lg:col-span-3">
          <Link href="/" className="flex items-center mb-6">
            <Image
              src={logoSrc}
              width={180}
              height={80}
              alt="IT-Job Logo"
              className="object-contain"
            />
          </Link>

          <p className="text-muted-foreground/90 mb-6 leading-relaxed">
            Nền tảng kết nối nhân tài IT hàng đầu Việt Nam. Tạo cầu nối giữa các
            chuyên gia công nghệ và cơ hội nghề nghiệp tuyệt vời.
          </p>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer hover:bg-primary transition-colors group"
            >
              <Github className="cursor-target h-4 w-4 group-hover:text-white" />
            </Button>
           <Button
              variant="outline"
              size="icon"
              className="cursor-pointer hover:bg-primary transition-colors group"
            >
              <Facebook className="cursor-target h-4 w-4 group-hover:text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer hover:bg-primary transition-colors group"
            >
              <Linkedin className="cursor-target h-4 w-4 group-hover:text-white" />
            </Button>
          </div>
        </div>

        {/* About Us Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-foreground/90 mb-4">
            Về chúng tôi
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground/80 hover:text-primary transition-colors flex items-center group"
              >
                Giới thiệu
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Tầm nhìn
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Sứ mệnh
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Đội ngũ
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Tuyển dụng
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-foreground/90 mb-4">Dịch vụ</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Tìm việc làm
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Đăng tin tuyển dụng
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Tư vấn nghề nghiệp
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Đánh giá kỹ năng
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Khóa học
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          </ul>
        </div>

        {/* For Employers Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-foreground/90 mb-4">Dành cho nhà tuyển dụng</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Đăng tin tuyển dụng
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Giải pháp tuyển dụng
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Báo cáo thị trường IT
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-target text-muted-foreground hover:text-primary transition-colors flex items-center group"
              >
                Tạo tài khoản
                <ArrowRight className="cursor-target h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-foreground/90 mb-4">Liên hệ</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-muted-foreground/80">
              <Mail className="cursor-target h-4 w-4 text-primary" />
              <span className="text-sm">contact@itjob.vn</span>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground/80">
              <Phone className="cursor-target h-4 w-4 text-primary" />
              <span className="text-sm">+84 123 456 789</span>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground/80">
              <MapPin className="cursor-target h-4 w-4 text-primary" />
              <span className="text-sm">Tp. Hồ Chí Minh, Việt Nam</span>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground/80">
              <Globe className="cursor-target h-4 w-4 text-primary" />
              <span className="text-sm">www.itjob.vn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12 pt-8 border-t border-border/50">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-muted-foreground/70">
            <span className="text-sm">© 2024 IT-Job Platform.</span>
            <span className="text-sm">Được phát triển với</span>
            <Heart className="cursor-target h-4 w-4 text-destructive fill-current animate-pulse" />
            <span className="text-sm">tại Việt Nam</span>
          </div>

          <div className="flex space-x-6 text-sm">
            <a
              href="#"
              className="cursor-target text-muted-foreground/70 hover:text-primary transition-colors"
            >
              Điều khoản sử dụng
            </a>
            <a
              href="#"
              className="cursor-target text-muted-foreground/70 hover:text-primary transition-colors"
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              className="cursor-target text-muted-foreground/70 hover:text-primary transition-colors"
            >
              Cookie
            </a>
            <a
              href="#"
              className="cursor-target text-muted-foreground/70 hover:text-primary transition-colors"
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
