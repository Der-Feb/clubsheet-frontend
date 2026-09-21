import { CommunicationLayout } from '@/features/communication/components/communication.layout';

export default async function ChatChannelPage({
  params,
}: {
  params: Promise<{ orgId: string; channelId: string }>;
}) {
  const { channelId } = await params;

  // Determine conversation type from the channelId prefix
  const conversationType: 'group' | 'dm' = channelId.startsWith('dm-') ? 'dm' : 'group';

  return (
    <div className="w-full h-dvh overflow-hidden">
      <CommunicationLayout
        initialConversationId={channelId}
        initialConversationType={conversationType}
      />
    </div>
  );
}
