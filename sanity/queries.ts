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

export const allProductSlugsQuery = groq`
  *[_type == "product" && active == true] {
    "slug": slug.current
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug && active == true][0] {
    _id,
    name,
    slug,
    description,
    images,
    price,
    stock
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    deliveryType,
    deliveryAmount,
    deliveryNote,
  }
`

export const ordersByEmailQuery = groq`
  *[_type == "order" && customerEmail == $email] | order(_createdAt desc) {
    _id,
    orderId,
    customerName,
    customerPhone,
    customerEmail,
    amount,
    status,
    payfastPaymentId,
    _createdAt,
    billingAddress {
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      country,
    },
    refundStatus,
    refundRequestedAt,
    items[] {
      productId,
      productName,
      quantity,
      price,
    }
  }
`
