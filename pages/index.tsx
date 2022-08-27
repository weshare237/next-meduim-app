import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'
import React, { useEffect, useState } from 'react'
import { sanityClient, urlFor } from '../lib/sanity'
import PostCard from '../components/PostCard'
import SkeletonCard from '../components/SkeletonCard'
import Footer from '../components/Footer/Footer'

interface Props {
  posts: Post[]
}

const Home: React.FC<Props> = ({ posts }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (posts) {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }, [posts])

  //Initialize an array of length 13 and fill it with 0's
  let skeletonCards = Array(5).fill(0)

  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Topicsy</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <Banner />
      {loading ? (
        skeletonCards.map((index: number) => <SkeletonCard key={index} />)
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
          {posts.map((post: Post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == 'post'] {
                    _id,
                    title,
                    author -> {
                      name, 
                      image
                    },
                    description,
                    mainImage,
                    slug
                 }`
  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}

export default Home
