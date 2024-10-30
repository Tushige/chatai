import React from 'react';
import { InputOTP, InputOTPSlot } from '../ui/input-otp';
import { FieldValues, UseFormRegister } from 'react-hook-form';

type Props = {
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  register: UseFormRegister<FieldValues>;
};

const OTPInput = ({ otp, setOtp, register }: Props) => {
  return (
    <InputOTP
      name='otp'
      maxLength={6}
      value={otp}
      {...register('otp')}
      onChange={(otp) => setOtp(otp)}
    >
      <div className='flex gap-3 text-text'>
        <div>
          <InputOTPSlot index={0} />
        </div>
        <div>
          <InputOTPSlot index={1} />
        </div>
        <div>
          <InputOTPSlot index={2} />
        </div>
        <div>
          <InputOTPSlot index={3} />
        </div>
        <div>
          <InputOTPSlot index={4} />
        </div>
        <div>
          <InputOTPSlot index={5} />
        </div>
      </div>
    </InputOTP>
  );
};

export default OTPInput;
