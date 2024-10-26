import { AdapterAccount } from 'next-auth/adapters';

import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from './prisma';

export function CustomPrismaAdapter(p = prisma) {
  const adapter = PrismaAdapter(p);
  return {
    ...adapter,
    createUser: adapter.createUser,
    getUser: adapter.getUser,
    getUserByEmail: adapter.getUserByEmail,
    async linkAccount(rawData: AdapterAccount) {
      const { created_at, secret_valid_until, ...accountData } = rawData as any;
      const data = {
        id: accountData.id ?? undefined,
        userId: accountData.userId,
        type: accountData.type,
        provider: accountData.provider,
        providerAccountId: accountData.providerAccountId,
        refresh_token: accountData.refresh_token ?? undefined,
        access_token: accountData.access_token ?? undefined,
        expires_at: accountData.expires_at ?? undefined,
        token_type: accountData.token_type ?? undefined,
        scope: accountData.scope ?? undefined,
        id_token: accountData.id_token ?? undefined,
        session_state: accountData.session_state ?? undefined,
      };
      try {
        await p.account.create({
          data,
        });
        return;
      } catch (error) {
        console.error('Error creating account:', error);
        throw error;
      }
    },
  };
}
