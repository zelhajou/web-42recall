import type { NextAuthOptions } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';

import { CustomPrismaAdapter } from './custom-prisma-adapter';

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(),
  providers: [
    FortyTwoProvider({
      clientId: process.env.FORTYTWO_CLIENT_ID!,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/42-school`
        }
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.login || profile.name,
          email: profile.email,
          image: profile.image?.versions?.small || profile.image?.link,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.sub ?? user.id;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === 'development',
};
