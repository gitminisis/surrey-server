import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
const BASE_OPAC_URL = process.env.BASE_OPAC_URL;
import { parse } from "node-html-parser";
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.name = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log({ session, token });

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
        console.log({ content, url });
        console.log({ credentials });
        // If no error and we have content data, return it
        if (res.ok && content) {
          // return content;
          const userCount =
            parse(content).querySelector("#user-count")?.innerText;
          console.log({ userCount });
          if (userCount && parseInt(userCount) === 1) {
            console.log("pass");
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
