import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import clientPromise from "@/lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [GitHub],
  secret: process.env.JWT_SECRET,
  session: { strategy: "database" },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.leaderboardOptIn = Boolean((user as { leaderboardOptIn?: boolean }).leaderboardOptIn);
      return session;
    },
  },
});
