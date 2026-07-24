import CompanyDetailPage from "@/components/_pages/company/company-detail.page";
import { companyApi } from "@/apis/company.api";
import { getMetadata } from "@/utils/metadata";
import { extractIdFromSlug, createSlugWithId } from "@/utils/string";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const companyId = extractIdFromSlug(slug);

  try {
    const company = await companyApi.getById(companyId);
    if (!company) {
      return getMetadata({
        title: "Không tìm thấy công ty | IT Job",
        noIndex: true,
      });
    }

    const title = `${company.name} - Thông tin & Cơ hội việc làm | IT Job`;
    const cleanDesc = company.description
      ? company.description.replace(/<[^>]*>/g, "").substring(0, 160)
      : `Khám phá môi trường làm việc, văn hóa công ty và các cơ hội tuyển dụng hấp dẫn tại ${company.name}.`;
    const image = company.avatar || company.coverimage || "/icons/icon.svg";
    const canonicalSlug = createSlugWithId(company.name, company.id);

    return getMetadata({
      title,
      description: cleanDesc,
      image,
      path: `/cong-ty/${canonicalSlug}`,
    });
  } catch (error) {
    return getMetadata("Chi tiết công ty | IT Job");
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const companyId = extractIdFromSlug(slug);
  let companyData = null;

  try {
    companyData = await companyApi.getById(companyId);
  } catch (e) {
    // Error handled inside CompanyDetailPage
  }

  if (companyData) {
    const expectedSlug = createSlugWithId(companyData.name, companyData.id);
    if (slug !== expectedSlug) {
      redirect(`/cong-ty/${expectedSlug}`);
    }
  }

  const canonicalUrl = companyData ? `/cong-ty/${createSlugWithId(companyData.name, companyData.id)}` : `/cong-ty/${slug}`;

  const companySchema = companyData
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: companyData.name,
        url: companyData.website || `https://it-job.vn${canonicalUrl}`,
        logo: companyData.avatar,
        description: companyData.description?.replace(/<[^>]*>/g, ""),
        address: companyData.address
          ? {
              "@type": "PostalAddress",
              streetAddress: companyData.address,
              addressLocality: companyData.city || "Việt Nam",
              addressCountry: "VN",
            }
          : undefined,
      }
    : null;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Trang chủ", url: "/trang-chu" },
    { name: "Công ty", url: "/cong-ty" },
    { name: companyData?.name || "Chi tiết công ty", url: canonicalUrl },
  ]);

  return (
    <>
      {companySchema && <JsonLd data={companySchema} />}
      <JsonLd data={breadcrumbSchema} />
      <CompanyDetailPage companyid={String(companyId)} />
    </>
  );
}
