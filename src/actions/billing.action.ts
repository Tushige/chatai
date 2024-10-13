import { client } from '@/lib/prisma';

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
