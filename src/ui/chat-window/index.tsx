import { getCBKChatbot } from '@/actions/chatbot.action';
import ChatUI from './chat-ui';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';

const ChatWindow = async ({ domain, className = ''}) => {
  const bot = await getCBKChatbot(domain.chatBot.chatBotKitId);
  if (!bot) {
    console.error('bot not found');
    redirect('/');
  }
  return <ChatUI bot={bot} domain={domain} className={cn(className)} />;
};

export default ChatWindow;
