import { z, ZodType } from 'zod';

export interface CampaignProps {
  name: string;
  description?: string;
}

export const CampaignSchema: ZodType<CampaignProps> = z.object({
  name: z
    .string()
    .min(4, { message: 'Your Campaign name must have at least 4 characters' }),
  description: z.string().optional(),
});

export interface EmailTemplateProps {
  subject: string;
  text: string;
}
export const EmailTemplateSchema: ZodType<EmailTemplateProps> = z.object({
  subject: z.string().min(1),
  text: z.string(),
});
