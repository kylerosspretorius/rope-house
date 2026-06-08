import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'nextAuthVerificationToken',
  title: 'Verification Token',
  type: 'document',
  fields: [
    defineField({ name: 'identifier', type: 'string' }),
    defineField({ name: 'token', type: 'string' }),
    defineField({ name: 'expires', type: 'datetime' }),
  ],
})
