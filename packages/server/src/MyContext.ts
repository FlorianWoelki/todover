import { Prisma, PrismaClient } from '@prisma/client';

export interface MyContext {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}
