import { z, ZodType } from 'zod';

export type BotQuestionProps = {
  question: string;
};

export const BotQuestionSchema: ZodType<BotQuestionProps> = z.object({
  question: z
    .string()
    .min(3, { message: 'your question should contain at least 3 characters' }),
});
