import { redirect } from 'next/navigation';

export default async function ChatOrgPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  redirect(`/chat/${orgId}/grp-general`);
}
