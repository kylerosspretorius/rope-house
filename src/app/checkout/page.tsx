import { client } from '../../../sanity/lib/client'
import { siteSettingsQuery } from '../../../sanity/queries'
import CheckoutForm from './CheckoutForm'

export interface DeliverySettings {
  deliveryType: 'fixed' | 'free' | 'flexible'
  deliveryAmount?: number
  deliveryNote?: string
}

export default async function CheckoutPage() {
  const delivery: DeliverySettings | null = await client.fetch(siteSettingsQuery)
  return <CheckoutForm delivery={delivery} />
}
