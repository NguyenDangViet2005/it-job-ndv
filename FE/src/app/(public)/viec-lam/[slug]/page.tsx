import JobDetailPage from "@/components/_pages/user/job-detail.page";
import { jobApi } from "@/apis/job.api";
import { getMetadata } from "@/utils/metadata";
import { extractIdFromSlug, createSlugWithId } from "@/utils/string";
import { JsonLd, createJobPostingSchema, createBreadcrumbSchema } from "@/components/seo/json-ld";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const jobId = extractIdFromSlug(slug);

  try {
    const job = await jobApi.getById(jobId);
    if (!job) {
      return getMetadata({
        title: "Không tìm thấy công việc | IT Job",
        noIndex: true,
      });
    }

    const companyName = job.company?.name || "Tuyển dụng IT";
    const title = `${job.title} - ${companyName} | IT Job`;
    const cleanDesc = job.description
      ? job.description.replace(/<[^>]*>/g, "").substring(0, 160)
      : `Ứng tuyển ngay vị trí ${job.title} tại ${companyName} với mức lương hấp dẫn và nhiều đãi ngộ tại IT Job.`;
    const image = job.company?.avatar || "/icons/icon.svg";
    const canonicalSlug = createSlugWithId(job.title, job.id);

    return getMetadata({
      title,
      description: cleanDesc,
      image,
      path: `/viec-lam/${canonicalSlug}`,
    });
  } catch (error) {
    return getMetadata("Chi tiết công việc | IT Job");
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const jobId = extractIdFromSlug(slug);
  let jobData = null;

  try {
    jobData = await jobApi.getById(jobId);
  } catch (e) {
    // Error handled in JobDetailPage
  }

  if (jobData) {
    const expectedSlug = createSlugWithId(jobData.title, jobData.id);
    if (slug !== expectedSlug) {
      redirect(`/viec-lam/${expectedSlug}`);
    }
  }

  const jobSchema = jobData
    ? createJobPostingSchema({
        title: jobData.title,
        description: jobData.description?.replace(/<[^>]*>/g, "") || jobData.title,
        companyName: jobData.company?.name || "IT Company",
        companyLogo: jobData.company?.avatar,
        location: jobData.location || jobData.company?.address || "Việt Nam",
        validThrough: jobData.deadline ? new Date(jobData.deadline).toISOString() : undefined,
        datePosted: jobData.createdat ? new Date(jobData.createdat).toISOString() : undefined,
      })
    : null;

  const canonicalUrl = jobData ? `/viec-lam/${createSlugWithId(jobData.title, jobData.id)}` : `/viec-lam/${slug}`;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Trang chủ", url: "/trang-chu" },
    { name: "Việc làm", url: "/viec-lam" },
    { name: jobData?.title || "Chi tiết công việc", url: canonicalUrl },
  ]);

  return (
    <>
      {jobSchema && <JsonLd data={jobSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <JobDetailPage jobid={String(jobId)} />
    </>
  );
}
