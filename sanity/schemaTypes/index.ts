import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import order from './order'
import siteSettings from './siteSettings'
import stockNotification from './stockNotification'
import nextAuthUser from './nextAuthUser'
import nextAuthAccount from './nextAuthAccount'
import nextAuthSession from './nextAuthSession'
import nextAuthVerificationToken from './nextAuthVerificationToken'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, order, siteSettings, stockNotification, nextAuthUser, nextAuthAccount, nextAuthSession, nextAuthVerificationToken],
}
