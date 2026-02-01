import CompanyDetailPage from "@/pages/company/company-detail.page";
import { companyApi } from "@/apis";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const companyid = parseInt(slug);
  
  if (isNaN(companyid)) {
    notFound();
  }

  try {
    const company = await companyApi.getById(companyid);
    
    if (!company) {
      notFound();
    }

    return <CompanyDetailPage company={company} />;
  } catch (error) {
    notFound();
  }
}

export const dynamic = 'force-dynamic';
