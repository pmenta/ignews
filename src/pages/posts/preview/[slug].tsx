import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import * as RichText from '@prismicio/helpers'

import { createClient } from '../../../services/prismic'

import type { ParsedUrlQuery } from 'querystring'
import type { GetStaticProps, GetStaticPaths } from 'next'

import styles from '../post.module.scss'

interface IParams extends ParsedUrlQuery {
  slug: string
}

interface IPostPreview {
  post: {
    slug: string
    title: string
    content: string
    updated_at: string
  }
}

export default function PostPreview({ post }: IPostPreview) {
  const { data: session } = useSession()
  const { push } = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      push(`/posts/${post.slug}`)
    }
  }, [post.slug, push, session])

  return (
    <>
      <Head>
        <title>{post.title.toString()} - igNews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updated_at}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={`${styles.postContent} ${styles.previewContent}`}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as IParams

  const prismic = createClient()

  const page = await prismic.getByUID('publication', slug)

  const post = {
    slug: page.uid,
    title: RichText.asText(page.data.title),
    content: RichText.asHTML(page.data.content.slice(0, 3)),
    updated_at: new Date(page.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  }

  return {
    props: { post },
    revalidate: 60 * 60 * 24,
  }
}
