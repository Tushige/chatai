'use client';
import { getAuthId } from '@/actions/auth';
import { selectPlan } from '@/actions/billing.action';
import { getAvailablePrices } from '@/actions/stripe';
import { getUserBilling } from '@/actions/user.action';
import { GradientText } from '@/components/app-gradient-text';
import Loader from '@/components/loader';
import Confetti, { ConfettiRef } from '@/components/ui/confetti';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const MembershipChangePlan = ({}) => {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const confettiRef = useRef<ConfettiRef>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (success) {
      (async () => {
        try {
          const authId = await getAuthId();
          const {billing} = await getUserBilling(authId!);
          const currentSubscription = await getAvailablePrices(billing.stripeCustomerId);
          await selectPlan(billing.id, currentSubscription.currentPrice.nickname!);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [success])
  if (loading) {
    <div className='size-full py-12'>
      <Loader className='h-[30px] w-[30px]' />
    </div>
  }
  // TODO - upon successful purchase, we need to save stripe client id in our DB so that later the same customer can change their plans
  // do we save this client id from within a webhook?
  if (success === 'true') {
    return (
      <div className='relative flex h-[100vh] w-full justify-center'>
        <GradientText className='mt-[30px] text-3xl font-bold uppercase sm:text-4xl md:mt-[100px] lg:mt-[200px] lg:text-6xl'>
          Congratulations!
        </GradientText>
        <Confetti
          ref={confettiRef}
          className='absolute left-0 top-0 z-[0] size-full'
          onMouseEnter={() => {
            confettiRef.current?.fire({});
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="size-full flex justify-center items-center">
        <h1 className="text-xl">Oops! Something went wrong.</h1>
      </div>
    );
  }
};

export default MembershipChangePlan;
