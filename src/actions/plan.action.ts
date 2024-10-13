'use server';
import { client } from '@/lib/prisma';

export const getPlan = async (name: string) => {
  try {
    const plan = await client.plan.findUnique({
      where: {
        name,
      },
    });
    if (!plan) {
      throw new Error('plan not found');
    }
    return plan;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
