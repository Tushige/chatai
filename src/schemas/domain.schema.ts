import { z, ZodType } from 'zod';

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

/**
 * fields you need to CREATE a Domain record
 */
export interface DomainProps {
  name: string;
  botName?: string;
  icon?: File;
  welcomeMessage?: string;
}

/**
 * fields you need to UPDATE a Domain record
 */
export interface DomainUpdateProps extends DomainProps {
  welcomeMessage: string;
}

export const DomainSchema: ZodType<DomainProps> = z.object({
  name: z
    .string()
    .min(4, { message: 'Your domain name must have at least 4 characters' })
    .refine(
      (value) =>
        /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,3}$/.test(value ?? ''),
      'This is not a valid domain'
    ),
  botName: z  
    .string()
    .min(2, {message: 'Please provide a valid name for your bot'}),
  icon: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        return files?.[0]?.size <= MAX_UPLOAD_SIZE;
      },
      {
        message: `Your file size must be less than 2MB. Your size`,
      }
    )
    .refine(
      (files) => {
        if (!files) return true;
        return ACCEPTED_FILE_TYPES.includes(files?.[0]?.type);
      },
      {
        message: 'Only JPG, JPEG & PNG are accepted file formats',
      }
    ),
  welcomeMessage: z
    .string()
    .min(6, 'Your message must have at least 6 characters')
    .optional(),
});
