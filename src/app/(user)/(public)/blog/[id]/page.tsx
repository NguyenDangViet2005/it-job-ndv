import BlogDetailPage from "@/pages/user/blog-detail.page";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <BlogDetailPage id={id} />
    </>
  );
}

export default page;
