import CompaniesPage from "@/pages/company/companies.page";

export const metadata: Metadata = {
  title: "IT Job | Các công ty IT hàng đầu",
  description: "IT Job | Các công ty IT hàng đầu",
  icons: {
    icon: [
      { url: "/icons/icon.svg", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export default function Page() {
  return <CompaniesPage />;
}
