import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { DefaultSession } from "next-auth";
const BASE_OPAC_URL = process.env.BASE_OPAC_URL;
import { parse } from "node-html-parser";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      tenant_id: string;
      tenant_password: string;
    } & DefaultSession["user"];
  }
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.name = user.username;
        token.tenant_id = process.env.TENANT_ID;
        token.tenant_password = process.env.TENANT_PASSWORD;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.tenant_id = token.tenant_id;
        session.user.tenant_password = token.tenant_password;
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: "minisis",
      name: "MINISIS Inc.",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Credentials not found");
        const url = `${BASE_OPAC_URL}/scripts/mwimain.dll/144/USER_PROFILE/WEB_CHECK_USER?SESSIONSEARCH&NOMSG=[SURREY_OPAC]new_account.xml&EXP=USER_NAME "${credentials?.username}" and USER_PASSWORD "${credentials?.password}"`;
        const res = await fetch(url);
        const content = await res.text();
        if (!res.ok || !content) return null;
        // If no error and we have content data, return it
        if (res.ok && content) {
          // return content;
          const userCount =
            parse(content).querySelector("#user-count")?.innerText;
          if (userCount && parseInt(userCount) === 1) {
            return {
              username: credentials.username,
            };
          }
          return null;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
