import { User } from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        identifier: { label: "Email or username", type: "text", placeholder: "jsmith@example.com or jsmith" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await connectToDatabase();

          const user = await User.findOne({
            $or: [{ username: credentials.identifier }, { email: credentials.identifier }],
          });

          if (!user) {
            throw new Error(" user do not exist for given credentials")
          };

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            throw new Error("incorrect password")
          };

          return user
        } catch (err: any) {
          throw new Error(err)
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};
