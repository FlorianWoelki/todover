import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const email = 'test@test.de';
const password = '123';

export const createUser = async (prisma: PrismaClient): Promise<void> => {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    await prisma.user.delete({ where: { email } });
  }

  await prisma.user.create({
    data: {
      email,
      password: await hash(password, 12),
    },
  });
};

export const cleanupUser = async (prisma: PrismaClient): Promise<void> => {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    await prisma.user.delete({ where: { email } });
  }
};
