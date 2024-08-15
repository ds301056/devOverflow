'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import { ViewQuestionParams } from './shared.types'
import Interaction from '@/database/interaction.model'

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase()

    // destructuring the params
    const { questionId, userId } = params

    // update the view count for the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } })

    if (userId) {
      // create an interaction record
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: 'view',
        question: questionId,
      })

      // has the user interacted with this question before?
      if (existingInteraction)
        return console.log('user has already viewed this question')

      // No? then create a new interaction record
      await Interaction.create({
        user: userId,
        action: 'view',
        question: questionId,
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
