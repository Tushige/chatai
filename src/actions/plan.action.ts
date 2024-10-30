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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to fetch plan';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};
