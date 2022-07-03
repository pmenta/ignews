import Head from 'next/head'
import { getSession } from 'next-auth/react'
import * as RichText from '@prismicio/helpers'
import { createClient } from '../../services/prismic'

import type { ParsedUrlQuery } from 'querystring'
import type { GetServerSideProps } from 'next'

import styles from './post.module.scss'

interface IParams extends ParsedUrlQuery {
  slug: string
}

interface IPost {
  post: {
    slug: string
    title: string
    content: string
    updated_at: string
  }
}

export default function Post({ post }: IPost) {
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
            className={styles.postContent}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req })

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { slug } = params as IParams

  const prismic = createClient({ req })

  const page = await prismic.getByUID('publication', slug)

  const post = {
    slug: page.uid,
    title: RichText.asText(page.data.title),
    content: RichText.asHTML(page.data.content),
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
  }
}
