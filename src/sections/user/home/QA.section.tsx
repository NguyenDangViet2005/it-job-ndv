"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SectionTitle from "@/components/ui/customs/section-title";
import { blogApi } from "@/apis";
import type { BlogResponse } from "@/types/api.type";

function QASection() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const response = await blogApi.getAll(1, 6);
        setBlogs(response.data);
      } catch (err) {
        console.error("❌ Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-2 lg:mx-0">
        <SectionTitle 
          title="Blog IT" 
          subtitle="Kiến thức và kinh nghiệm từ cộng đồng IT"
          showViewAll 
          viewAllLink="/blog"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </div>
    );
  }

  const featured = blogs[0]; // Blog đầu tiên làm featured
  const others = blogs.slice(1); // Các blog còn lại

  return (
    <div className="w-full px-2 lg:mx-0">
      <SectionTitle 
        title="Blog IT" 
        subtitle="Kiến thức và kinh nghiệm từ cộng đồng IT"
        showViewAll 
        viewAllLink="/blog"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {featured && (
          <div className="md:col-span-7">
            <a href={`/blog/${featured.id}`} className="block group">
              <div className="w-full h-[220px] md:h-[350px] relative overflow-hidden shadow rounded-xl">
                <Image
                  src={featured.image || "/cover.png"}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>
              <h3 className="mt-3 font-bold text-lg md:text-xl group-hover:text-primary transition">
                {featured.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 md:line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{featured.author}</span>
                <span>•</span>
                <span>{featured.readTime}</span>
                <span>•</span>
                <span>{new Date(featured.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <span className="text-primary text-sm mt-1 inline-block hover:underline">
                Đọc thêm
              </span>
            </a>
          </div>
        )}

        <div className="md:col-span-5 flex flex-col gap-4 max-h-[450px] overflow-auto">
          {others.map((blog) => (
            <a
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="flex gap-3 group border-b pb-3 last:border-none"
            >
              <div className="w-[120px] md:w-[150px] h-[80px] relative overflow-hidden flex-shrink-0 rounded-lg">
                <Image
                  src={blog.image || "/cover.png"}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                  sizes="150px"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm md:text-base group-hover:text-primary transition line-clamp-2">
                  {blog.title}
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QASection;

const oldBlogs = [
  {
    title: "7 kinh nghiệm hữu ích khi làm việc với GIT trong dự án",
    desc: "Bài viết được sự cho phép của tác giả Sơn Dương Git là một công cụ không thể thiếu...",
    image:
      "https://salt-2.topdev.vn/JohoPgp8csRxm526Oo0oJ4eB5S61LjJs8n6eCeMXXh0/rs:fit/w:600/h:282/el:1/g:ce/ext:webp/aHR0cHM6Ly90b3BkZXYudm4vYmxvZy93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8xMC9raW5oLW5naGllbS1zdS1kdW5nLWdpdC10cm9uZy1kdS1hbi5wbmc",
    link: "#",
    featured: true,
  },
  {
    title: "Bài tập Python từ cơ bản đến nâng cao (có lời giải)",
    desc: "Python là một ngôn ngữ lập trình bậc cao, mã nguồn mở được sử dụng rộng rãi...",
    image:
      "https://salt-2.topdev.vn/DxZEF2Q3mJ9NI5a2-VLlT_379bvDMXQnp9-VTNKEDZ0/rs:fit/w:208/h:128/el:1/g:ce/ext:webp/aHR0cHM6Ly90b3BkZXYudm4vYmxvZy93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8xMC9iYWktdGFwLXB5dGhvbi10dS1jby1iYW4tZGVuLW5hbmctY2FvLWNvLWxvaS1naWFpLWNvbXByZXNzZWQuanBn",
    link: "#",
  },
  {
    title: "Những thực phẩm lập trình viên nên và không nên ăn",
    desc: "Dinh dưỡng đóng vai trò rất quan trọng đối với sức khỏe và hiệu suất làm việc...",
    image:
      "https://salt-2.topdev.vn/TlEiQpye_0jxDh-Zdd2dzns4xVObGlx3XvtwB8ZYW34/rs:fit/w:208/h:128/el:1/g:ce/ext:webp/aHR0cHM6Ly90b3BkZXYudm4vYmxvZy93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8xMC9uaHVuZy10aHVjLXBoYW0tbGFwLXRyaW5oLXZpZW4tbmVuLXZhLWtob25nLW5lbi1hbi5qcGc",
    link: "#",
  },
  {
    title:
      "KICC HCMC x TOPDEV - Bước đệm nâng tầm sự nghiệp cho nhân tài IT Việt Nam",
    desc: "Năm 2024, chương trình hợp tác giữa KICC HCMC x TOPDEV sẽ quay trở lại...",
    image:
      "https://salt-2.topdev.vn/fh7YP_lzV0VXIQFz8kLmNmBDc_mea4Gf2skJ28UunLM/rs:fit/w:208/h:128/el:1/g:ce/ext:webp/aHR0cHM6Ly90b3BkZXYudm4vYmxvZy93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8xMC9raWNjeHRvcGRldi5wbmc",
    link: "#",
  },
  {
    title:
      "KICC HCMC x TOPDEV - Bước đệm nâng tầm sự nghiệp cho nhân tài IT Việt Nam",
    desc: "Năm 2024, chương trình hợp tác giữa KICC HCMC x TOPDEV sẽ quay trở lại...",
    image:
      "https://salt-2.topdev.vn/fh7YP_lzV0VXIQFz8kLmNmBDc_mea4Gf2skJ28UunLM/rs:fit/w:208/h:128/el:1/g:ce/ext:webp/aHR0cHM6Ly90b3BkZXYudm4vYmxvZy93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8xMC9raWNjeHRvcGRldi5wbmc",
    link: "#",
  },
  {
    title:
      "KICC HCMC x TOPDEV - Bước đệm nâng tầm sự nghiệp cho nhân tài IT Việt Nam",
    desc: "Năm 2024, chương trình hợp tác giữa KICC HCMC x TOPDEV sẽ quay trở lại...",
    image:
      "https://salt-2.topdev.vn/fh7YP_lzV0VXIQFz8kLmNmBDc_mea4Gf2skJ28UunLM/rs:fit/w:208/h:128/el:1/g:ce/ext:webp/aHR0cHM6Ly90b3BkZXYudm4vYmxvZy93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8xMC9raWNjeHRvcGRldi5wbmc",
    link: "#",
  },
  {
    title: "7 kinh nghiệm hữu ích khi làm việc với GIT trong dự án",
    desc: "Bài viết được sự cho phép của tác giả Sơn Dương Git là một công cụ không thể thiếu...",
    image:
      "https://salt-2.topdev.vn/JohoPgp8csRxm526Oo0oJ4eB5S61LjJs8n6eCeMXXh0/rs:fit/w:600/h:282/el:1/g:ce/ext:webp/aHR0cHM6Ly90b3BkZXYudm4vYmxvZy93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8xMC9raW5oLW5naGllbS1zdS1kdW5nLWdpdC10cm9uZy1kdS1hbi5wbmc",
    link: "#",
    featured: true,
  },
  {
    title: "Bài tập Python từ cơ bản đến nâng cao (có lời giải)",
    desc: "Python là một ngôn ngữ lập trình bậc cao, mã nguồn mở được sử dụng rộng rãi...",
    image:
      "https://salt-2.topdev.vn/DxZEF2Q3mJ9NI5a2-VLlT_379bvDMXQnp9-VTNKEDZ0/rs:fit/w:208/h:128/el:1/g:ce/ext:webp/aHR0cHM6Ly90b3BkZXYudm4vYmxvZy93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8xMC9iYWktdGFwLXB5dGhvbi10dS1jby1iYW4tZGVuLW5hbmctY2FvLWNvLWxvaS1naWFpLWNvbXByZXNzZWQuanBn",
    link: "#",
  },
  {
    title: "Những thực phẩm lập trình viên nên và không nên ăn",
    desc: "Dinh dưỡng đóng vai trò rất quan trọng đối với sức khỏe và hiệu suất làm việc...",
    image:
      "https://salt-2.topdev.vn/TlEiQpye_0jxDh-Zdd2dzns4xVObGlx3XvtwB8ZYW34/rs:fit/w:208/h:128/el:1/g:ce/ext:webp/aHR0cHM6Ly90b3BkZXYudm4vYmxvZy93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8xMC9uaHVuZy10aHVjLXBoYW0tbGFwLXRyaW5oLXZpZW4tbmVuLXZhLWtob25nLW5lbi1hbi5qcGc",
    link: "#",
  },
];
