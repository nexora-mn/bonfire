import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'

export const post = defineType({
  name: 'post',
  title: 'Нийтлэл',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Гарчиг',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'Latin letters, numbers and hyphens, e.g. "why-bonfire".',
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return true
          return /^[a-z0-9-]+$/.test(slug.current) || 'Lowercase latin letters, numbers and hyphens only'
        }),
    }),
    defineField({
      name: 'excerpt',
      title: 'Товч агуулга',
      type: 'text',
      rows: 3,
      validation: (rule) => [
        rule.required(),
        rule.max(200).warning('Keep it under 200 characters'),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Ангилал',
      type: 'string',
      options: {
        list: ['Мэдээ', 'Зөвлөгөө', 'Өсөлт', 'Бүтээлч амьдрал', 'Технологи'],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Нийтэлсэн огноо',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Нүүр зураг',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for screen readers.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Агуулга',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Subheading', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'caption', type: 'string' }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' },
  },
})
