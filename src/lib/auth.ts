import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { SanityAdapter } from 'next-auth-sanity'
import { Resend } from 'resend'
import { writeClient } from '../../sanity/lib/writeClient'

const resend = new Resend(process.env.RESEND_API_KEY)

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: SanityAdapter(writeClient as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: process.env.AUTH_EMAIL_FROM!,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        await resend.emails.send({
          from: process.env.AUTH_EMAIL_FROM!,
          to: email,
          subject: 'Sign in to The Rope House',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px">
              <h2 style="font-size:20px;font-weight:300;color:#1c1917;margin-bottom:16px">Sign in to The Rope House</h2>
              <p style="font-size:14px;color:#78716c;line-height:1.6;margin-bottom:24px">
                Click the button below to sign in. This link expires in 24 hours.
              </p>
              <a href="${url}" style="display:inline-block;background:#1c1917;color:#fff;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:14px 32px;text-decoration:none">
                Sign In
              </a>
              <p style="font-size:12px;color:#a8a29e;margin-top:24px">
                If you did not request this email, you can safely ignore it.
              </p>
            </div>
          `,
        })
      },
    }),
  ],
  pages: {
    signIn: '/account/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
}
