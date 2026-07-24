import BlogDetailPage from "@/components/_pages/user/blog-detail.page";
import { blogApi } from "@/apis/blog.api";
import { getMetadata } from "@/utils/metadata";
import { extractIdFromSlug, createSlugWithId } from "@/utils/string";
import { JsonLd, createArticleSchema, createBreadcrumbSchema } from "@/components/seo/json-ld";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blogId = extractIdFromSlug(slug);

  try {
    const blog = await blogApi.getById(blogId);
    if (!blog) {
      return getMetadata({
        title: "Không tìm thấy bài viết | IT Job",
        noIndex: true,
      });
    }

    const title = `${blog.title} | IT Job Blog`;
    const cleanDesc = (blog.excerpt || blog.content || "")
      .replace(/<[^>]*>/g, "")
      .substring(0, 160);
    const image = blog.image || blog.avatar || "/icons/icon.svg";
    const canonicalSlug = createSlugWithId(blog.title, blog.id);

    return getMetadata({
      title,
      description: cleanDesc,
      image,
      path: `/bai-viet/${canonicalSlug}`,
    });
  } catch (error) {
    return getMetadata("Chi tiết bài viết | IT Job Blog");
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const blogId = extractIdFromSlug(slug);
  let blogData = null;

  try {
    blogData = await blogApi.getById(blogId);
  } catch (e) {
    // Error handled inside BlogDetailPage
  }

  if (blogData) {
    const expectedSlug = createSlugWithId(blogData.title, blogData.id);
    if (slug !== expectedSlug) {
      redirect(`/bai-viet/${expectedSlug}`);
    }
  }

  const canonicalUrl = blogData ? `/bai-viet/${createSlugWithId(blogData.title, blogData.id)}` : `/bai-viet/${slug}`;

  const articleSchema = blogData
    ? createArticleSchema({
        title: blogData.title,
        description: (blogData.excerpt || blogData.content || "").replace(/<[^>]*>/g, "").substring(0, 200),
        image: blogData.image || blogData.avatar,
        datePublished: blogData.createdat ? new Date(blogData.createdat).toISOString() : undefined,
        authorName: blogData.author || "IT Job",
      })
    : null;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Trang chủ", url: "/trang-chu" },
    { name: "Bài viết", url: "/bai-viet" },
    { name: blogData?.title || "Chi tiết bài viết", url: canonicalUrl },
  ]);

  return (
    <>
      {articleSchema && <JsonLd data={articleSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <BlogDetailPage id={String(blogId)} />
    </>
  );
}
