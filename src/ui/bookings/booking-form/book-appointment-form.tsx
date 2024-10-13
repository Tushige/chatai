'use client';
import { createBooking } from '@/actions/bookings.action';
import { StepsProvider } from '@/context/use-steps-context';
import { combineDateAndTime } from '@/lib/utils';
import {
  BookAppointmentProps,
  BookAppointmentSchema,
} from '@/schemas/appointment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import BookAppointmentSteps from './bbok-appointment-steps';
import FormProgressBar from '@/components/forms/sign-up/form-progress-bar';
import { useRouter } from 'next/navigation';

const times = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];
const BookAppointmentForm = ({ domainId }: { domainId: string }) => {
  const [time, setTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<BookAppointmentProps>({
    resolver: zodResolver(BookAppointmentSchema),
  });
  const {
    register,
    formState: { errors },
  } = form;

  const handleSubmit = async (data: BookAppointmentProps) => {
    try {
      setLoading(true);
      const combinedDate = combineDateAndTime(data.date, time);
      const isoDate = combinedDate.toISOString();
      // book appointment
      const newBooking = await createBooking(isoDate, data.email, domainId);
      router.push(`/bookings/${newBooking.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  return (
    <div className='w-full'>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <StepsProvider>
            <div>
              <BookAppointmentSteps
                domainId={domainId}
                form={form}
                register={register}
                errors={errors}
                times={times}
                time={time}
                setTime={setTime}
                loading={loading}
              />
            </div>
            <FormProgressBar className='mt-8' />
          </StepsProvider>
        </form>
      </FormProvider>
    </div>
  );
};
export default BookAppointmentForm;
