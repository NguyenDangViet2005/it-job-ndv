import CompaniesPage from "@/components/_pages/company/companies.page"; 
import { getMetadata } from "@/utils";

export const metadata = getMetadata("IT Job | Các công ty IT hàng đầu");

export default function Page() {
  return <CompaniesPage />;
}
