import { NextRequest, NextResponse } from "next/server";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],session:{
    strategy:"jwt"
  },
  callbacks: {
    async jwt({ token,account }) {
      if(account){
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
   session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
