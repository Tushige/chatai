'use server';
import { client } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Add a new domain record then return the updated list of questions
 */
export const createBotQuestion = async (question: string, domainId: string) => {
  try {
    const createdQuestion = await client.questions.create({
      data: {
        question,
        domain: {
          connect: {
            id: domainId,
          },
        },
      },
    });
    if (!createdQuestion) {
      throw new Error('Failed to create a new bot question');
    }
    const questions = await getBotQuestionsByDomainId(domainId);
    revalidatePath('/');
    return questions;
  } catch (err) {
    throw new Error(err);
  }
};

export const getBotQuestionsByDomainId = async (domainId: string) => {
  try {
    const questions = await client.questions.findMany({
      where: {
        domainId,
      },
    });
    return questions;
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteBotQuestion = async (id: string, domainId: string) => {
  try {
    const deletedQuestion = await client.questions.delete({
      where: {
        id,
      },
    });
    if (!deletedQuestion) {
      throw new Error('Failed to delete question');
    }
    const questions = await client.questions.findMany({
      where: {
        domainId,
      },
      select: {
        id: true,
        question: true,
      },
    });
    revalidatePath('/');
    return questions;
  } catch (err) {
    throw new Error(err);
  }
};
