import {PrismaClient } from '@prisma/client'

declare global {
  let prisma: PrismaClient | undefined
}

export const client = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'PRODUCTION') {
  globalThis.prisma = client
}