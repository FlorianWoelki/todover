import { PrismaClient } from '@prisma/client';

export const revokeRefreshToken = async (prisma: PrismaClient, userId: number): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      tokenVersion: {
        increment: 1,
      },
    },
  });
};
