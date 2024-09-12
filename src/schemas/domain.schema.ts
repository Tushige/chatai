import { z, ZodType } from "zod";

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 2 // 2MB
export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg']

export interface Domain {
  id: string,
  name: string,
  icon: string // Upload Care image id
}

/**
 * fields you need to create a Domain record
 */
export type DomainProps = {
  name: string,
  icon?: any,
  welcomeMessage?: string
}

export const DomainSchema: ZodType<DomainProps> = z
  .object({
    name: z
      .string()
      .min(4, {message: 'Your domain name must have at least 4 characters'})
      .refine(value => /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,3}$/.test(value ?? ''),
      'This is not a valid domain'
    ),
    icon: z
      .any()
      .refine((files) => {
        return files?.[0]?.size <= MAX_UPLOAD_SIZE
      }, {
        message: `Your file size must be less then 2MB. Your size`,
      })
      .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), {
        message: 'Only JPG, JPEG & PNG are accepted file formats',
      }),
    welcomeMessage:  z
      .string()
      .min(6, 'Your message must have at least 6 characters')
      .optional()
  })