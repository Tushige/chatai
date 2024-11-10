'use server';
import { client } from '@/lib/prisma';
/**
 * fetch user
 */
export const createBooking = async (
  date: string,
  email: string,
  domainId: string
) => {
  let contact = await client.contact.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  // create a new contact if there isn't one. But realistically, we should always have an existing contact;
  if (!contact) {
    contact = await client.contact.create({
      data: {
        email,
        domain: {
          connect: {
            id: domainId,
          },
        },
      },
    });
  }
  try {
    // upsert contact
    const booking = await client.booking.create({
      data: {
        date,
        domain: {
          connect: {
            id: domainId,
          },
        },
        contact: {
          connect: {
            id: contact.id,
          },
        },
      },
      select: {
        id: true,
        date: true,
        contact: {
          select: {
            id: true,
            email: true,
          },
        },
        domainId: true,
      },
    });
    return booking;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('Failed to create booking');
    }
  }
};
export const getBooking = async (id: string) => {
  try {
    const booking = await client.booking.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        date: true,
      },
    });
    return booking;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('Failed to fetch booking record');
    }
  }
};

/**
 * returns upcoming bookings
 */
export const getBookingsSummary = async () => {
  try {
    const bookings = await client.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        date: {
          gt: new Date()
        }
      },
      select: {
        id: true,
        date: true,
        contact: {
          select: {
            id: true,
            email: true,
            discoveryResponses: true,
          },
        },
        domain: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 10,
    });
    return bookings;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('Failed to fetch booking summary');
    }
  }
};

export const getBookingsByDomain = async (domainId: string) => {
  try {
    const bookings = await client.booking.findMany({
      where: {
        domainId,
      },
      select: {
        id: true,
        date: true,
        contact: {
          select: {
            id: true,
            email: true,
          },
        },
        domain: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!bookings) {
      throw new Error('Failed to get appointments for a domain');
    }
    return bookings;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      throw new Error(err.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('Failed to fetch bookings');
    }
  }
};

export const getBookingsByDate = async (domainId: string, date: string) => {
  const dateObj = new Date(Date.parse(date));
  try {
    const bookings = await client.booking.findMany({
      where: {
        domainId,
        date: {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lte: new Date(dateObj.setHours(23, 59, 59, 999)),
        },
      },
      select: {
        id: true,
        date: true,
      },
    });
    console.log('***bookings are')
    console.log(bookings)
    return bookings;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('getBookingsByDate - failed to fetch bookings')
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      console.error('Failed to get bookings for date');
      throw new Error('Failed to get bookings for date');
    }
  }
};
