import JobsPage from "@/pages/user/jobs.page";

export const metadata: Metadata = {
  title: "IT Job | Tìm kiếm công việc IT",
  description: "IT Job | Tìm kiếm công việc IT",
  icons: {
    icon: [
      { url: "/icons/icon.svg", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

function page() {
  return (
    <>
      <JobsPage />
    </>
  );
}

export default page;
