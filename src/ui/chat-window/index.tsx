import { getCBKChatbot } from '@/actions/chatbot.action';
import ChatUI from './chat-ui';
import { redirect } from 'next/navigation';

const ChatWindow = async ({ domain }) => {
  const bot = await getCBKChatbot(domain.chatBot.chatBotKitId);
  if (!bot) {
    console.error('bot not found');
    redirect('/');
  }
  return <ChatUI bot={bot} domain={domain} />;
};

export default ChatWindow;
