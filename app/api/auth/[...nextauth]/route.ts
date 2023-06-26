import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

connectToDB();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      //@ts-ignore
      clientId: process.env.GOOGLE_CLIENT_ID,
      //@ts-ignore
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        //@ts-ignore
        email: session.user.email,
      });
      //@ts-ignore
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        //check if user already exists
        const userExists = await User.findOne({
          //@ts-ignore
          email: profile.email,
        });
        //if not create new user
        if (!userExists) {
          await User.create({
            //@ts-ignore
            email: profile.email,
            //@ts-ignore
            username: profile.name.replace(/\s/g, "").toLowerCase(),
            //@ts-ignore
            image: profile.picture,
          });
        }

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
