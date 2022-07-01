import { env } from 'process'

import Stripe from 'stripe'
import packageInfo from '../../package.json'

const stripe_key = env.STRIPE_API_KEY || ''

export const stripe = new Stripe(stripe_key, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'igNews',
    version: packageInfo.version,
  },
})
