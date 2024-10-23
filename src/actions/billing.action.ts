'use server'
import { client } from '@/lib/prisma';
import { getPlan } from './plan.action';
import { revalidatePath } from 'next/cache';

export const updateBilling = async (id, { ...data }) => {
  try {
    const billing = await client.billing.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * after we change plan on stripe, we change it in our db
 */
export const selectPlan = async (billingId: string, planName: string) => {
  try {
    if (!billingId || !planName) {
      throw new Error(`Please provide a valid billing id and plan name. you gave ${billingId} and ${planName}`)
    
    }
    const plan = await getPlan(planName.toUpperCase());
    const billing = await client.billing.update({
      where: {
        id: billingId
      },
      data: {
        plan: {
          connect: {
            id: plan.id
          }
        }
      }
    })
    if (!billing) {
      throw new Error('failed to update billing');
    }
    revalidatePath('/')
    return billing;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}