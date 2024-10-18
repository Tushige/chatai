'use client';
import React, { useEffect, useState } from 'react';
import { getUserBilling } from '@/actions/user.action';
import Loader from '@/components/loader';
import { getAuthId } from '@/actions/auth';
import { cn } from '@/lib/utils';
import { getAvailablePrices, updateSubscription } from '@/actions/stripe';
import { WithGlow } from '@/components/app-with-glow';
import { useToast } from '@/hooks/use-toast';
import MembershipPlanCard from '@/ui/settings/memberships/MembershipPlanCard';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '@/lib/stripe';
import CheckoutForm from '@/ui/settings/memberships/CheckoutForm';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Stripe from 'stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { AppDate } from '@/components/app-date';
import { CheckCircle } from 'lucide-react';
import GridPattern from '@/components/ui/grid-pattern';
import { ConfettiFireworks } from '@/components/app-fireworks';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import AppSectionContainer from '@/components/app-section-container';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const SUCCEEDED = 'succeeded';
type PaymentOptionsType = StripeElementsOptions & {
  payment_intent_status: string;
};
const initialPaymentOptions = {
  appearance: {
    theme: 'night',
    labels: 'floating',
  },
  clientSecret: undefined,
  payment_intent_status: '',
};

type Price = Stripe.Price;
type Billing = {
  customerId: string;
  subscriptionId: string;
  subscriptionItemId: string;
  prices: Price[];
  currentPrice: Price;
  currentPeriodEnd: number;
};
/**
 * we fetch products from Stripe to display them for the customer to choose from
 * we fetch subscription to show customers their active subscription
 */
const MembershipPage = () => {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOptionsType>(
    initialPaymentOptions
  );
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const { toast } = useToast();

  const fetchBilling = async () => {
    try {
      const authId = await getAuthId();
      let billing = await getUserBilling(authId);
      billing = billing.billing;
      const subscription = await getAvailablePrices(billing.stripeCustomerId);
      setBilling({
        ...subscription,
        customerId: billing.stripeCustomerId,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const checkout = async (price) => {
    setSelectedPrice(price);
    setLoading(true);
    try {
      const { subscriptionId, clientSecret, payment_intent_status } =
        await updateSubscription(
          billing.customerId,
          billing?.subscriptionId,
          billing?.subscriptionItemId,
          price.id
        );

      // payment options is used by Stripe Elements
      setPaymentOptions((prev) => ({
        ...prev,
        clientSecret,
        payment_intent_status,
      }));
      if (payment_intent_status === SUCCEEDED) {
        // payment succeded so no need to collect payment info
        if (price.nickname === 'Premium') {
          setConfettiActive(true);
        }
        fetchBilling();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: <span className='text-error'>Error</span>,
        description: 'Something went wrong. Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  if (!billing) {
    return (
      <div className='flex h-[90vh] w-full items-center justify-center'>
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <AppSectionHeroContainer>
        <ConfettiFireworks active={confettiActive} />
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/settings'>Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-text-foreground'>
                Membership
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className='relative text-4xl font-bold'>Membership</h1>
        <p className="text-text-secondary text-sm">
          Manage your subscription plans
        </p>
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <PlanText
          className='mt-8'
          currentPrice={billing.currentPrice}
          currentPeriodEnd={billing.currentPeriodEnd}
        />
        <Sheet>
          <div className='mt-8 w-full'>
            <ul className='z-[2] flex flex-col gap-4 lg:flex-row lg:gap-8'>
              {billing.prices.map((d) => {
                const features = JSON.parse(
                  d.metadata.features.replace(/'/g, '"')
                );
                if (d.nickname === 'Premium') {
                  return (
                    <WithGlow
                      key={d.nickname}
                      className='rounded-xl bg-surface p-4 pb-12 lg:p-8'
                    >
                      <MembershipPlanCard
                        premium
                        priceId={d.id}
                        name={d.nickname}
                        unitAmount={d.unit_amount}
                        features={features}
                        className='relative z-10'
                        onClick={() => checkout(d)}
                        currentPrice={billing.currentPrice}
                        loading={loading}
                      />
                    </WithGlow>
                  );
                }
                return (
                  <MembershipPlanCard
                    key={d.nickname}
                    className='rounded-xl bg-surface p-4 pb-12 lg:p-8'
                    priceId={d.id}
                    name={d.nickname}
                    unitAmount={d.unit_amount}
                    features={features}
                    onClick={() => checkout(d)}
                    currentPrice={billing.currentPrice}
                  />
                );
              })}
            </ul>
          </div>
          <SheetContent className='text-text'>
            {loading ? (
              <div className='flex h-[90vh] w-full items-center justify-center'>
                <Loader />
              </div>
            ) : paymentOptions.payment_intent_status === SUCCEEDED ? (
              <div className='flex size-full flex-col items-center justify-center'>
                <CheckCircle className='size-24 text-success' />
                <span className='text-xl text-text'>You're all set!</span>
              </div>
            ) : paymentOptions.clientSecret ? (
              <>
                <SheetHeader>
                  <SheetTitle className='mb-4 text-text'>
                    Subscribe to {selectedPrice?.nickname}
                  </SheetTitle>
                </SheetHeader>
                <Elements stripe={getStripe()} options={paymentOptions}>
                  <CheckoutForm />
                </Elements>
              </>
            ) : (
              <div className='text-4xl'>Unexpected State</div>
            )}
            `
          </SheetContent>
        </Sheet>
      </AppSectionContainer>
    </div>
  );
};

type PlanTextProps = {
  className: string;
  currentPrice: Price;
  currentPeriodEnd: number;
};
const PlanText = ({
  className,
  currentPrice,
  currentPeriodEnd,
}: PlanTextProps) => {
  return (
    <div className={cn(className)}>
      <p className='text-text'>
        Your current plan is{' '}
        <span className='font-bold text-text-foreground'>
          {currentPrice.nickname}
        </span>
      </p>
      <p className=''>
        Next payment: <AppDate timestamp={currentPeriodEnd * 1000} />
      </p>
      <p className='mt-4 text-text'>
        {currentPrice.nickname === 'Premium'
          ? 'Congratulations. You have access to all the available features and resources we offer'
          : 'Upgrade to Premium plan to unlock access to more features and resources'!}
      </p>
    </div>
  );
};
export default MembershipPage;
