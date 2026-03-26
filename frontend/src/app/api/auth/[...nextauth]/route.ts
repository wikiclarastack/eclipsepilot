import NextAuth, { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email" } },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordProfile = profile as { id: string; username: string };
        const { error } = await supabase.from("users").upsert(
          {
            discord_id: discordProfile.id,
            username: discordProfile.username,
            role: "user",
          },
          { onConflict: "discord_id" }
        );
        if (error) console.error("Supabase upsert error:", error);
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { discordId?: string }).discordId = token.discordId as string;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordProfile = profile as { id: string };
        token.discordId = discordProfile.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
