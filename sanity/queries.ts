import { groq } from 'next-sanity'

export const allProductsQuery = groq`
  *[_type == "product" && active == true] | order(_createdAt asc) {
    _id,
    name,
    slug,
    description,
    images,
    price,
    stock
  }
`
