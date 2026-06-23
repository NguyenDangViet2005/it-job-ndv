import CompanyDetailPage from "@/components/_pages/company/company-detail.page";
type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function Page({params}: Props) {
  const {id} = await params
  console.log(id);
  
  return <CompanyDetailPage companyid={id} />;
}

