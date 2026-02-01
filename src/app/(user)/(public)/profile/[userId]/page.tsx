import ProfilePage from "@/pages/user/profile.page";

export default async function Page({ params }: { params: Promise<{ userid: string }> }) {
  const { userid } = await params;
  return <ProfilePage userid={userid} />;
}
