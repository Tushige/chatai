import { getCBKChatbot } from '@/actions/chatbot.action';
import ChatUI from './chat-ui';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';

const ChatWindow = async ({ domain, className = ''}) => {
  const cbkBot = await getCBKChatbot(domain.chatBot.chatBotKitId);
  if (!cbkBot) {
    console.error('bot not found');
    redirect('/');
  }
  return <ChatUI cbkBot={cbkBot} domain={domain} className={cn(className)} />;
};

export default ChatWindow;
