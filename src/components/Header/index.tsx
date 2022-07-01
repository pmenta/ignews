import Img from 'next/image'
import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'

export function Header() {
  return(
    <header className={styles.headerContainer} >
      <div className={styles.headerContent}>
        <Img src="/images/logo.svg" alt="Logo" width={108} height={30} />
        <nav>
          <a className={styles.active}>Home</a>
          <a>Posts</a>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}