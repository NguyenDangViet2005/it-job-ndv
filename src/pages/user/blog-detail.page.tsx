import BlogDetailSection from "@/sections/user/blog/blog-detail.section";

interface BlogDetailPageProps {
  id: string;
}

function BlogDetailPage({ id }: BlogDetailPageProps) {
  return (
    <div className="bg-background">
      <div className="max-w-[900px] mx-auto px-4 py-20">
        <BlogDetailSection id={id} />
      </div>
    </div>
  );
}

export default BlogDetailPage;
