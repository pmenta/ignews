import styles from './styles.module.scss'

interface ISubscribeButton {
  productId: string
}

export function SubscribeButton({ productId }: ISubscribeButton) {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  )
}
