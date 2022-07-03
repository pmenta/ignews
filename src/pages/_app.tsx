import { SessionProvider as NextAuthProvider } from 'next-auth/react'
import { PrismicProvider } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import { linkResolver, repositoryName } from '../services/prismic'

import { Header } from '../components/Header'

import type { AppProps } from 'next/app'
import '../styles/global.scss'
import Link from 'next/link'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <NextAuthProvider session={session}>
        <PrismicProvider
          linkResolver={linkResolver}
          internalLinkComponent={({ href, children, ...props }) => (
            <Link href={href}>
              <a {...props}>{children}</a>
            </Link>
          )}
        >
          <PrismicPreview repositoryName={repositoryName}>
            <Header />
            <Component {...pageProps} />
          </PrismicPreview>
        </PrismicProvider>
      </NextAuthProvider>
    </>
  )
}

export default MyApp
