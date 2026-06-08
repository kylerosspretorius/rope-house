import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'nextAuthSession',
  title: 'Auth Session',
  type: 'document',
  fields: [
    defineField({ name: 'userId', type: 'string' }),
    defineField({ name: 'expires', type: 'datetime' }),
    defineField({ name: 'sessionToken', type: 'string' }),
  ],
})
