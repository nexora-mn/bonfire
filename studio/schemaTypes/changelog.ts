import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons/Rocket'

export const changelog = defineType({
  name: 'changelog',
  title: 'Шинэчлэл',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Гарчиг',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Хувилбар',
      type: 'string',
      description: 'Optional, e.g. "1.4.0".',
    }),
    defineField({
      name: 'releasedAt',
      title: 'Гарсан огноо',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Агуулга',
      type: 'markdown',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'releasedAtDesc',
      by: [{ field: 'releasedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', version: 'version', date: 'releasedAt' },
    prepare: ({ title, version, date }) => ({
      title,
      subtitle: [version, date].filter(Boolean).join(' · '),
    }),
  },
})
