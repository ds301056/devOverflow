import * as z from 'zod'

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(15),
  tags: z.array(z.string().min(1).max(20)).min(1).max(5),
})

export const AnswerSchema = z.object({
  answer: z.string().min(30),
})

export const ProfileSchema = z.object({
  name: z.string().min(2).max(40),
  username: z.string().min(2).max(30),
  portfolioWebsite: z.string().url(),
  location: z.string().min(2).max(40),
  bio: z.string().min(10).max(150),
})
