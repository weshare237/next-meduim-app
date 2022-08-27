import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../lib/sanity'
import PortableText from 'react-portable-text'
import { FaCommentMedical } from 'react-icons/fa'
import { useForm, SubmitHandler } from 'react-hook-form'

interface Props {
  post: Post
}

const Post: React.FC<Props> = ({ post }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <main>
      <Header />

      <img
        className='w-full h-40 object-cover'
        src={urlFor(post.mainImage).url()}
        alt=''
      />

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
      <form className='flex flex-col p-5 max-w-2xl mx-auto mb-10'>
        <h3 className='text-sm text-green-500'>Enjoyed this article?</h3>
        <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
        <hr className='py-3 mt-2' />

        <div className='mb-6'>
          <label
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            htmlFor='name'
          >
            Your name
          </label>
          <input
            type='text'
            id='name'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Demo FKD'
            required
          />
        </div>
        <div className='mb-6'>
          <label
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            htmlFor='email'
          >
            Your email
          </label>
          <input
            type='email'
            id='email'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            required
          />
        </div>

        <div className='mb-6'>
          <label
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            htmlFor='comment'
          >
            Your comment
          </label>

          <textarea
            name='comment'
            id='comment'
            cols={30}
            rows={10}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            required
          />
        </div>

        <button
          type='submit'
          className='text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800'
        >
          <FaCommentMedical className='mx-auto text-2xl' />
        </button>
      </form>
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
