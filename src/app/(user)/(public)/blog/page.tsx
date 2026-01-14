import BlogPage from "@/pages/user/blog.page";

export const metadata: Metadata = {
  title: "IT Job | Blog về công việc IT",
  description: "IT Job | Blog về công việc IT",
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
      <BlogPage />
    </>
  );
}

export default page;
