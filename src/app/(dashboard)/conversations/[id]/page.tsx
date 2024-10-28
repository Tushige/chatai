/**
  this page displays the messenger/messages for the selected conversation
*/

import { getConversation } from "@/actions/conversations.action";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import ConversationMessenger from "@/ui/conversations/conversation-messenger";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const ConversationPage = async ({params}) => {
  const {id} = params;
  if (!id) {
    redirect('/conversations');
  }
  const conversation = await getConversation(id);
  return (
    <div className='relative h-full flex flex-col min-w-[400px] max-w-[960px] px-5'>
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]',
          'z-0'
        )}
      />
      <Link href="/conversations" className="flex flex-row gap-2 items-center py-4">
        <IconArrowLeft className="size-4" />
        <span className="text-text">Back</span>
      </Link>
      <ConversationMessenger
        conversation={conversation}
      />
    </div>
  )
}

export default ConversationPage;