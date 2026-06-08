import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'nextAuthAccount',
  title: 'Auth Account',
  type: 'document',
  fields: [
    defineField({ name: 'userId', type: 'string' }),
    defineField({ name: 'type', type: 'string' }),
    defineField({ name: 'provider', type: 'string' }),
    defineField({ name: 'providerAccountId', type: 'string' }),
    defineField({ name: 'refresh_token', type: 'text' }),
    defineField({ name: 'access_token', type: 'text' }),
    defineField({ name: 'expires_at', type: 'number' }),
    defineField({ name: 'token_type', type: 'string' }),
    defineField({ name: 'scope', type: 'string' }),
    defineField({ name: 'id_token', type: 'text' }),
    defineField({ name: 'session_state', type: 'string' }),
  ],
})
