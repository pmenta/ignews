import { query as q } from 'faunadb'

import NextAuth, { DefaultSession } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

import { fauna } from '../../../services/fauna'

interface IUserSubscription {
  data: {
    status: 'active' | 'cancelled' | 'inactive'
  }
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      let userActiveSubscription = { data: { status: 'inactive' } }
      try {
        userActiveSubscription = await fauna.query<IUserSubscription>(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session?.user?.email || '')
                    )
                  )
                )
              ),
              q.Match(q.Index('subscription_by_status'), 'active'),
            ])
          )
        )
      } catch {
        throw new Error('FaunaDB query error')
      }

      return { ...session, activeSubscription: userActiveSubscription.data }
    },
    async signIn({ user }) {
      const email = user.email || ''

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email)))
            ),
            q.Create(q.Collection('users'), { data: email }),
            q.Get(q.Match(q.Index('user_by_email'), q.Casefold(email)))
          )
        )

        return true
      } catch {
        return false
      }
    },
  },
})
