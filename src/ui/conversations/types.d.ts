type Message = {
  id: string;
  type: string;
  text: string;
  createdAt: number;
  updatedAt: number;
  meta: any;
};
type Conversation = {
  id: string;
  messages: Message[];
  live: boolean,
  createdAt: string
  email: string | null;
  customerLive: boolean;
};

export { Message, Conversation };
