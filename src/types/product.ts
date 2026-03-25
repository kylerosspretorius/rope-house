export interface ProductImage {
  _key: string
  asset: {
    _ref: string
  }
  alt?: string
}

export interface Product {
  _id: string
  name: string
  slug: { current: string }
  description: string
  images: ProductImage[]
  price: number
  stock: number
}

export interface CartItem extends Product {
  quantity: number
}
