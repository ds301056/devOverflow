// create answers server action that can be called from the fron end to create a new answer for a question

'use server'

import Answer from '@/database/answer.model'
import { connectToDatabase } from '../mongoose'
import { CreateAnswerParams } from './shared.types'
import Question from '@/database/question.model'
import { revalidatePath } from 'next/cache'

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase()

    // destructure the params
    const { content, author, question, path } = params

    const newAnswer = new Answer({ content, author, question })

    // add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    })

    // TODO: Add interaction..
    revalidatePath(path) // revalidate the question page to show the new answer
  } catch (error) {
    console.log('Error in createAnswer', error)
    throw error
  }
}
