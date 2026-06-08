import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('order').title('Orders'),
      S.documentTypeListItem('stockNotification').title('Stock Waitlist'),
      S.divider(),
      S.documentTypeListItem('nextAuthUser').title('Customers'),
      S.divider(),
      S.documentTypeListItem('nextAuthAccount').title('Auth Accounts'),
      S.documentTypeListItem('nextAuthSession').title('Auth Sessions'),
      S.documentTypeListItem('nextAuthVerificationToken').title('Verification Tokens'),
    ])
