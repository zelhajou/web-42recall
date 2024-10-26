import { Prisma } from '@prisma/client';

declare global {
  namespace PrismaTypes {
    type UserWithRelations = Prisma.UserGetPayload<{
      include: {
        accounts: true;
        sessions: true;
      };
    }>;
  }
}
