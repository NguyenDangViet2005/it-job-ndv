import BlogDetailSection from "@/components/sections/blog/blog-detail.section";

interface BlogDetailPageProps {
  id: string;
}

function BlogDetailPage({ id }: BlogDetailPageProps) {
  return (
    <div className="bg-background pb-20 sm:pb-0">
      <div className="max-w-[900px] mx-auto px-3 lg:px-4 py-10 lg:py-20">
        <BlogDetailSection id={id} />
      </div>
    </div>
  );
}

export default BlogDetailPage;
