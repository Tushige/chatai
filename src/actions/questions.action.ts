'use server'
import { client } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const createBotQuestion = async (question: string, domainId: string) => {
  try {
    const createdQuestion = await client.questions.create({
      data: {
        question,
        domain: {
          connect: {
            id: domainId
          }
        }
      }
    })
    if (!createdQuestion) {
      throw new Error('Failed to create a new bot question')
    }
    revalidatePath('/')
    return createdQuestion
  } catch (err) {
    throw new Error(err)
  }
}

export const getBotQuestionsByDomainId = async (domainId: string) => {
  try {
    const questions = await client.questions.findMany({
      where: {
        domainId
      }
    })
    return questions
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteBotQuestion = async (id: string) => {
  try {
    const questions = await client.questions.delete({
      where: {
        id
      }
    })
    if (!questions) {
      throw new Error('Failed to delete question')
    }
    revalidatePath('/')
  } catch (err) {
    throw new Error(err)
  }
}