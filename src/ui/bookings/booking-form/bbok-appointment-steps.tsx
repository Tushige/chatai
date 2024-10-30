'use client';
import { getBookingsByDate } from '@/actions/bookings.action';
import FormBuilder from '@/components/forms/form-builder';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useStepsContext } from '@/context/use-steps-context';
import { cn, isWeekend } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Booking } from '../booking.types';
import { useToast } from '@/hooks/use-toast';
import { timeFormat } from '@/lib/date-utils';

const BookAppointmentSteps = ({
  domainId,
  form,
  register,
  errors,
  times,
  time,
  setTime,
  loading,
}) => {
  const { currentStep } = useStepsContext();

  switch (currentStep) {
    case 1:
      return <BookAppointmentEmail register={register} errors={errors} />;
    case 2:
      return <BookAppointmentDate form={form} />;
    case 3:
      return (
        <BookAppointmentDay
          domainId={domainId}
          times={times}
          time={time}
          setTime={setTime}
          loading={loading}
        />
      );
    default:
      return <div>uh oh</div>;
  }
};
function BookAppointmentEmail({ register, errors }) {
  const { setCurrentStep } = useStepsContext();
  const { trigger, clearErrors } = useFormContext();
  const handleNext = async () => {
    const isValid = await trigger('email');
    if (isValid) {
      clearErrors();
      setCurrentStep((prev) => prev + 1);
    }
  };
  return (
    <div>
      <FormBuilder
        inputType='input'
        label='Email'
        name='email'
        placeholder='Enter your email'
        type='email'
        register={register}
        errors={errors}
        className='mb-4 max-w-[400px]'
      />
      <Button
        type='submit'
        className='mt-4 w-full border border-border text-text hover:bg-surface lg:max-w-[400px]'
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
}
function BookAppointmentDate({ form }) {
  const { setCurrentStep } = useStepsContext();
  const { trigger, clearErrors } = useFormContext();
  const handleNext = async () => {
    const isValid = await trigger('date');
    if (isValid) {
      clearErrors();
      setCurrentStep((prev) => prev + 1);
    }
  };
  return (
    <div>
      <CalenderInput form={form} />
      <div className='mt-8 flex gap-4'>
        <Button
          className='mt-4 w-full border border-border text-text hover:bg-surface lg:max-w-[400px]'
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          Back
        </Button>
        <Button
          className='mt-4 w-full border border-border text-text hover:bg-surface lg:max-w-[400px]'
          type='submit'
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
function BookAppointmentDay({ domainId, times, time, setTime, loading }) {
  const { toast } = useToast();
  const [takenTimes, setTakenTimes] = useState([]);
  const { setCurrentStep } = useStepsContext();
  const { getValues } = useFormContext();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    async function getAvailableTimes() {
      try {
        const selectedDate = getValues('date');
        const existingBookings = await getBookingsByDate(
          domainId,
          selectedDate
        );
        const takenTimes = existingBookings.map((booking: Booking) => {
          const val = timeFormat(booking.date, true);
          return val;
        });
        setTakenTimes(takenTimes);
        setReady(true);
      } catch (err) {
        console.error(err);
        toast({
          title: <div className='text-error'>Error</div>,
          description: 'Something went wrong!',
        });
      }
    }
    getAvailableTimes();
  }, [domainId, getValues, toast]);

  if (loading || !ready) {
    return (
      <div className='py-12'>
        <Loader className='size-8' />
      </div>
    );
  }
  return (
    <div className='flex flex-col items-center'>
      <span className='text-sm font-medium text-text'>Pick a Time</span>
      <DaypickerInput
        times={times}
        takenTimes={takenTimes}
        time={time}
        setTime={setTime}
        className='mt-8'
      />
      <div className='mt-8 flex w-full justify-between gap-4'>
        <Button
          className='mt-4 text-text hover:bg-surface'
          onClick={() => {
            setCurrentStep((prev) => prev - 1);
          }}
        >
          Back
        </Button>
        <Button
          className='mt-4 w-full border border-border text-text hover:bg-surface lg:max-w-[400px]'
          type='submit'
        >
          Book appointment
        </Button>
      </div>
    </div>
  );
}

function CalenderInput({ form }) {
  return (
    <FormField
      control={form.control}
      name='date'
      render={({ field }) => (
        <FormItem className='flex flex-col items-center'>
          <FormLabel className='text-sm font-medium text-text'>
            Pick a Date
          </FormLabel>
          <Calendar
            mode='single'
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => {
              const today = new Date();
              const oneMonthAway = new Date();
              oneMonthAway.setMonth(today.getMonth() + 1);
              return date < today || date > oneMonthAway || isWeekend(date);
            }}
          />
          <FormMessage className='text-error' />
        </FormItem>
      )}
    />
  );
}

function DaypickerInput({
  times,
  takenTimes,
  time,
  setTime,
  className,
}: {
  time: string;
  times: string[];
  takenTimes: string[];
  setTime: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) {
  const takenTimesSet = new Set(takenTimes);
  return (
    <ul className={cn('grid w-full grid-cols-3 gap-4', className)}>
      {times.map((d) => (
        <Button
          key={d}
          className={cn(
            'rounded-md border border-border p-4 text-text hover:bg-surface disabled:border-0',
            { 'bg-surface': time === d }
          )}
          type='button'
          onClick={() => setTime(d)}
          disabled={takenTimesSet.has(d)}
        >
          {d}
        </Button>
      ))}
    </ul>
  );
}
export default BookAppointmentSteps;
