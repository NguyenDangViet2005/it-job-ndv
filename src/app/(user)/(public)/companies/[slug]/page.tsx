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
  
  // Convert slug to ID (assuming slug is the company ID)
  const companyId = parseInt(slug);
  
  if (isNaN(companyId)) {
    notFound();
  }

  try {
    const company = await companyApi.getById(companyId);
    
    if (!company) {
      notFound();
    }

    return <CompanyDetailPage company={company} />;
  } catch (error) {
    notFound();
  }
}

export const dynamic = 'force-dynamic';
