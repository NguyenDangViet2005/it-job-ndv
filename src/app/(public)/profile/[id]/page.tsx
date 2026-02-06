import ProfilePage from "@/components/_pages/user/profile.page";

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function Page({params}: Props) {
    const {id} = await params
  return <ProfilePage userid={id} />;
}
