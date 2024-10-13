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
  email: string | null;
};

export { Message, Conversation };
