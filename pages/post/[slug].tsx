import { GetStaticProps } from 'next'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../lib/sanity'
import PortableText from 'react-portable-text'
import CommentForm from '../../components/CommentForm'
import SkeletonCard from '../../components/SkeletonCard'
import CommentCard from '../../components/CommentCard'
import Footer from '../../components/Footer/Footer'

interface Props {
  post: Post
}

const Post: React.FC<Props> = ({ post }) => {
  console.log(post)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (post) {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }, [post])

  return (
    <main>
      <Header />

      <img
        className='w-full h-40 object-cover'
        src={urlFor(post.mainImage).url()}
        alt=''
      />

      {loading ? (
        <SkeletonCard />
      ) : (
        <>
          <article className='max-w-3xl mx-auto p-5'>
            <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-2'>
              {post.description}
            </h2>

            <div className='flex items-center space-x-2'>
              <img
                className='h-10 w-10 rounded-full'
                src={urlFor(post.author.image).url()}
                alt=''
              />
              <p className='font-extralight text-sm'>
                Blog post by{' '}
                <span className='text-violet-600'>{post.author.name}</span> -
                Published at {new Date(post._createdAt).toLocaleString()}
              </p>
            </div>

            <div className='mt-10'>
              <PortableText
                dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                content={post.body}
                serializers={{
                  h2: (props: any) => (
                    <h1 className='text-xl font-bold my-5' {...props} />
                  ),
                  link: ({ href, children }: any) => (
                    <a
                      href={href}
                      className='text-violet-500 hover:underline cursor-pointer'
                      target='__blank'
                    >
                      {children}
                    </a>
                  ),
                }}
              />
            </div>
          </article>

          <hr className='max-w-lg my-5 mx-auto border border-violet-500' />

          <CommentForm post={post} />

          <div className='flex flex-col p-10 my-10'>
            <hr className='pb-2' />
            {post.comments.map((comment: Comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))}
          </div>
          <Footer />
        </>
      )}
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `* [_type == 'post'] {
                   _id,
                   slug {
                     current
                   }
                 }`
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `* [_type == 'post' && slug.current == $slug] [0] {
                  _id,
                  _createdAt,
                  title,
                  author -> {
                    name,
                    image
                  },
                  "comments": * [
                    _type == "comment" && 
                    post._ref == ^._id && 
                    approved == true
                  ],
                  slug,
                  mainImage,
                  description,
                  body
                }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60 seconds, it will update the old cache version
  }
}
