interface Post {
  _id: string
  _createdAt: string
  title: string
  author: {
    name: string
    image: string
  }
  description: string
  mainImage: {
    asset: {
      url: string
    }
  }
  slug: {
    current: string
  }
  comments: Comment[]
  body: [object]
}

interface Comment {
  comment: string
  email: string
  name: string
  _createdAt: string
  _id: string
  approved: boolean
}

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}
