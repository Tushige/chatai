import { z, ZodType } from 'zod';

export interface BookAppointmentProps {
  email: string;
  date: Date;
}

export const BookAppointmentSchema: ZodType<BookAppointmentProps> = z.object({
  email: z.string().email('Please enter a valid email address'),
  date: z.date({ message: 'Please select a date' }),
  // .refine(val => {
  //   const date = new Date(val)
  //   return !isNaN(date.getTime())
  // }, {
  //   message: 'Invalid date and time format. Please use ISO 8601 format.'
  // })
});
