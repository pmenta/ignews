import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

import styles from './styles.module.scss'

interface ISubscribeButton {
  productId: string
}

export function SubscribeButton({ productId }: ISubscribeButton) {
  const { data: session } = useSession()
  const { push } = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    if (session.activeSubscription) {
      push('/posts')
      return
    }

    try {
      const { data } = await api.post('/subscribe')
      const { sessionId } = data

      const stripe = await getStripeJs()
      stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      alert(error)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={() => handleSubscribe()}
    >
      Subscribe now
    </button>
  )
}
