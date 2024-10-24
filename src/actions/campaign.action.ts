'use server';
import { client } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function createCampaign({
  name,
  description,
  domainId,
}: {
  name: string;
  description: string;
  domainId: string;
}) {
  try {
    const campaign = await client.campaign.create({
      data: {
        name,
        description,
        domain: {
          connect: {
            id: domainId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    if (!campaign) {
      throw new Error('Failed to create a campaign');
    }
    return campaign;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
export async function getCampaign(id: string) {
  try {
    const campaign = await client.campaign.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        domainId: true,
        contacts: {
          select: {
            id: true,
            email: true,
          },
        },
        emailBatches: {
          select: {
            id: true,
            count: true,
            createdAt: true,
          },
        },
      },
    });
    return campaign;
  } catch (err) {
    console.error(err);
  }
}
export async function getCampaignsByDomainId(domainId: string) {
  try {
    const campaigns = await client.campaign.findMany({
      where: {
        domainId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        contacts: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    return campaigns;
  } catch (err) {
    console.error(err);
  }
}
export async function updateCampaignContacts(id: string, contactIds: string[]) {
  try {
    const updated = await client.campaign.update({
      where: {
        id,
      },
      data: {
        contacts: {
          connect: contactIds.map((id) => ({ id })),
        },
      },
    });
    if (!updated) {
      throw new Error('Failed to add contacts to campaign');
    }
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
export async function totalEmailCountForUser(userId: string) {
  try {
    const count = await client.emailBatch.aggregate({
      _sum: {
        count: true,
      },
      where: {
        campaign: {
          domain: {
            userId,
          },
        },
      },
    });
    return count._sum.count || 0;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
export async function totalEmailCountForCampaign(campaignId: string) {
  try {
    const count = await client.emailBatch.aggregate({
      _sum: {
        count: true,
      },
      where: {
        campaignId,
      },
    });
    return count._sum.count || 0;
  } catch (err) {
    console.error(err);
  }
}
type SendEmailProps = {
  subject: string;
  text: string;
  to: string[];
  campaignId: string;
};
export async function sendEmail({
  subject,
  text,
  to,
  campaignId,
}: SendEmailProps) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS,
      },
    });
    const mailConfig = {
      to,
      subject,
      text,
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailConfig, async (err, info) => {
        if (err) {
          console.error(err);
          return reject({ message: 'Failed to send email' });
        }
        // save emails to our db
        const numEmails = to.length;
        const emailBatchRecord = await client.emailBatch.create({
          data: {
            count: numEmails,
            campaign: {
              connect: {
                id: campaignId,
              },
            },
          },
        });
        if (!emailBatchRecord) {
          // TODO - once we have an error loggin solution, we just record that email was sent successfully but we failed to save emails to the DB
          console.error('Failed to save emails to DB');
        }
        return resolve({
          status: 200,
          message: 'Email Sent!',
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
}