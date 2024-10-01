import { client } from "@/lib/prisma"

export const updateBilling = async (id, {...data}) => {
  console.log('[Update Billing]')
  console.log(data)
  try {
    const billing = await client.billing.update({
      where: {
        id
      },
      data: {
        ...data
      }
    })
  } catch (err) {
    console.error(err)
  }
}