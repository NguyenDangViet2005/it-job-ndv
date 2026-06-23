import JobDetailPage from "@/components/_pages/user/job-detail.page";

type Props = {
  params: Promise< {
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await  params;
  
  return <JobDetailPage jobid={id} />;
}
