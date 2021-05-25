import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { mockDeep, MockProxy } from 'jest-mock-extended';

export interface MyContext {
  res: Response;
  req: Request;
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  payload?: { userId: number };
}

export type MockContext = {
  prisma: MockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};
