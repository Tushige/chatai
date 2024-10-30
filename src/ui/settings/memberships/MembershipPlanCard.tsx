import { motion } from 'framer-motion';
import { GradientText } from '@/components/app-gradient-text';
import { Separator } from '@/components/ui/separator';
import { CheckCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SheetTrigger } from '@/components/ui/sheet';
import Stripe from 'stripe';

const MembershipPlanCard = ({
  premium,
  priceId,
  name,
  unitAmount,
  features,
  className,
  onClick,
  currentPrice,
}: {
  premium: boolean;
  priceId: string;
  name: string;
  unitAmount: number;
  features: string[];
  className: string;
  onClick: () => void;
  currentPrice: Stripe.Price;
}) => {
  const isCurrentPlan = currentPrice && currentPrice.id === priceId;
  return (
    <div className={cn(className)}>
      <h2>
        {premium ? (
          <GradientText className='text-2xl font-medium'>{name}</GradientText>
        ) : (
          <span className='text-2xl font-medium'>{name}</span>
        )}
      </h2>
      <div className='flex flex-row items-center gap-4'>
        <div className='mt-4 flex flex-row items-start'>
          <span className='text-md'>$</span>
          <motion.span className='text-4xl font-bold'>
            {unitAmount / 100.0}
          </motion.span>
          <span className='self-end'>/ per month</span>
        </div>
      </div>
      <ul className='mt-4'>
        {features.map((feature, idx) => (
          <li key={idx} className='flex flex-col'>
            <div className='flex flex-row gap-2 py-2'>
              <CheckCircleIcon className='w-4' />
              <span className='text-secondary text-sm'>{feature}</span>
            </div>
            <Separator className='border-border' />
          </li>
        ))}
      </ul>
      <div className='flex w-full flex-row justify-center'>
        <SheetTrigger
          className={cn('px-4 py-2 mt-8 rounded-md bg-accent text-text font-medium hover:bg-accent-hover hover:drop-shadow-2xl', {'bg-border pointer-events-none': isCurrentPlan})}
          onClick={() => onClick(priceId)}
          disabled={isCurrentPlan}
          >
            {isCurrentPlan ? 'Current plan' : 'Subscibe'}
        </SheetTrigger>
      </div>
    </div>
  );
};

export default MembershipPlanCard;
