'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { GradientText } from '@/components/app-gradient-text';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircleIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getUserBilling } from '@/actions/user.action';
import Loader from '@/components/loader';
import { getAuthId } from '@/actions/auth';
import { cn } from '@/lib/utils';
import { getAvailablePrices } from '@/actions/stripe';
import { WithGlow } from '@/components/app-with-glow';
import { useToast } from '@/hooks/use-toast';

/**
 * we fetch products from Stripe to display them for the customer to choose from
 * we fetch subscription to show customers their active subscription
 */
const MembershipPage = () => {
  const [billing, setBilling] = useState(null)
  const [prices, setPrices] = useState(null)
  const [loading, setLoading] = useState(false)
  const {toast} = useToast()

  const checkout = async (priceId) => {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({priceId, customerId: billing.stripeCustomerId})
      })
      const data = await res.json()
      if (res.ok) {
        window.location.href = data.url
      } else {
        throw new Error(data.error)
      }
    } catch(err) {
      console.error(err)
      toast({
        title: <span className="text-error">Error</span>,
        description: 'Something went wrong'
      })
    }
  }

  useEffect(() => {
    const fetcBilling = async () => {
      try {
        const authId = await getAuthId()
        let billing = await getUserBilling(authId)
        billing = billing.billing
        const {prices, current: currentPrice} = await getAvailablePrices(billing.stripeCustomerId)
        setBilling({
          ...billing,
          currentPrice
        })
        setPrices(prices)
      } catch (err) {
        console.error(err)
      }
    }
    fetcBilling()
  }, [])

  if (!billing || !prices || loading ) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <Loader />
      </div>
    )
  }
  return (
    <div>
      <h1 className="font-bold text-4xl">
        Membership
      </h1> 
      {
        billing.currentPrice.nickname === 'Free' && <FreePlanText className="mt-8" /> 
      }
      {
        billing.currentPrice.nickname === 'Basic' && <BasicPlanText className="mt-8" />
      }
      {
        billing.currentPrice.nickname === 'Premium' && <PremiumPlanText className="mt-8" />
      }
      <div className="mt-8">
        <ul className="flex flex-row gap-4 lg:gap-8">
          {
            prices.map(d => {
              const features = JSON.parse(d.metadata.features.replace(/'/g, '"'))
              if (d.nickname === 'Premium') {
                return (
                  <WithGlow
                    className="rounded-xl p-8 pb-12 bg-surface"
                  >
                    <PlanCard
                      premium
                      priceId={d.id}
                      key={d.nickname}
                      name={d.nickname}
                      unitAmount={d.unit_amount}
                      features={features}
                      className="relative z-10"
                      onClick={() => checkout(d.id)}
                      currentPrice={billing.currentPrice}
                    />
                  </WithGlow>
                )
              }
              return (
                <PlanCard
                  className="rounded-xl p-8 pb-12 bg-surface"
                  priceId={d.id}
                  key={d.nickname}
                  name={d.nickname}
                  unitAmount={d.unit_amount}
                  features={features}
                  onClick={() => checkout(d.id)}
                  currentPrice={billing.currentPrice}
                />
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

type Feature = {
  name: string
}

const PlanCard = ({
  premium,
  priceId,
  name,
  unitAmount,
  features,
  className,
  onClick,
  currentPrice
}: {
  premium: boolean,
  priceId: string,
  name: string,
  unitAmount: number,
  features: string[],
  onClick: any,
  currentPrice: any
}) => {
  const isCurrentPlan = currentPrice.id === priceId
  return (
    <div
      className={cn(className)}
    >
      <h2>
        {
          premium ? (
            <GradientText className="text-2xl font-medium">
              {name}
            </GradientText>
          ) : (
            <span className="text-2xl font-medium">{name}</span>
          )
        }
      </h2>
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-row items-start mt-4">
          <span className="text-md">
            $
          </span>
          <motion.span
            className="text-4xl font-bold"
          >
            {unitAmount / 100.0}
          </motion.span>
          <span className="self-end">/ per month</span>
        </div>
      </div>
      <ul className="mt-4">
        {
         features.map( (feature, idx) => (
          <li key={idx} className="flex flex-col">
            <div className="flex flex-row gap-2 py-2">
              <CheckCircleIcon className="w-4" />
              <span className="text-sm text-secondary">{feature}</span>
            </div>
            <Separator className="border-border"/>
          </li>
         )) 
        }
      </ul>
      <div className="w-full flex flex-row justify-center">
        <Button
          className="mt-8 bg-accent hover:bg-accent-hover text-text hover:drop-shadow-2xl"
          onClick={() => onClick(priceId)}
          disabled={isCurrentPlan}
        >
          {
            isCurrentPlan ? 'Current plan' : 'Subscibe'
          }
        </Button>
      </div>
    </div>
  )
}

const FreePlanText = ({ className }) => {
  return (
    <div className={cn(className)}>
      <p className="text-text">
        Your current plan is <span className="font-bold text-text-foreground">Free</span>
      </p>
      <p className="text-text">
        Upgrade your plan to unlock access to more resources.
      </p>
    </div>
  )
}

const BasicPlanText = ({className}) => {
  return (
    <div className={cn(className)}>
      <p className="text-text">
        Your current plan is <span className="font-bold text-text-foreground">Basic</span>
      </p>
      <p className="text-text">
        If you want to unlock access to more resources, upgrade your plan to Premium.
      </p>
    </div>
  )
}
const PremiumPlanText = ({className}) => {
  return (
    <div className={cn(className)}>
      <p className="text-text">
        Your current plan is <span className="font-bold text-text-foreground">Preium</span>
      </p>
      <p className="text-text">
        Congratulations. You have access to all available features and resources
      </p>
    </div>
  )
}
export default MembershipPage