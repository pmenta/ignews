import Head from 'next/head'

import { createClient } from '../../services/prismic'
import * as RichText from '@prismicio/helpers'

import type { GetStaticProps } from 'next'

import styles from './styles.module.scss'
import Link from 'next/link'

interface IPost {
  slug: string
  title: string
  excerpt: string
  updated_at: string
}

interface IPosts {
  posts: IPost[]
}

export default function Posts({ posts }: IPosts) {
  return (
    <>
      <Head>
        <title>igNews - Posts</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updated_at}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData })

  const pages = await client.getAllByType('publication', {
    fetch: ['post.title', 'post.content'],
    pageSize: 100,
  })

  const posts = pages.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find(
          (content: { type: string }) => content.type === 'paragraph'
        )?.text ?? '',
      updated_at: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    }
  })

  return {
    props: { posts },
  }
}
