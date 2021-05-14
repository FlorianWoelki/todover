import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface MyContext {
  res: Response;
  req: Request;
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  payload?: { userId: string };
}
