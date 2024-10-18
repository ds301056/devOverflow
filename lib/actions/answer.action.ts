'use server'

import Answer from '@/database/answer.model'
import { connectToDatabase } from '../mongoose'
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from './shared.types'
import Question from '@/database/question.model'
import { revalidatePath } from 'next/cache'
import Interaction from '@/database/interaction.model'
import User from '@/database/user.model'

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase()

    const { content, author, question, path } = params

    const newAnswer = await Answer.create({ content, author, question })

    // Add the answer to the question's answers array
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    })

    // add interaction for reputation
    await Interaction.create({
      user: author,
      action: 'answer',
      question,
      answer: newAnswer._id,
      tags: questionObject.tags,
    })

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase()

    const { questionId, sortBy, page = 1, pageSize = 5 } = params

    const skipAmount = (page - 1) * pageSize

    let sortOptions = {}

    switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = { upvotes: -1 }
        break
      case 'lowestUpvotes':
        sortOptions = { upvotes: 1 }
        break
      case 'recent':
        sortOptions = { createdAt: -1 }
        break
      case 'old':
        sortOptions = { createdAt: 1 }
        break

      default:
        break
    }

    // console.log({ questionId })

    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalAnswer = await Answer.countDocuments({ question: questionId })

    const isNextAnswer = totalAnswer > skipAmount + answers.length

    return { answers, isNextAnswer }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } }
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      }
    } else {
      updateQuery = { $addToSet: { upvotes: userId } }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })
    if (!answer) {
      throw new Error('Answer not found')
    }

    // Increment author's reputation by +10 for upvoting a question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    })
    // upvoting an answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    })

    revalidatePath(path)
  } catch (error) {
    console.error('Error upvoting answer:', error)
    throw error
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } }
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      }
    } else {
      updateQuery = { $addToSet: { downvotes: userId } }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })
    if (!answer) {
      throw new Error('Answer not found')
    }

    // Decrement author's reputation by +10 for dowvoting an answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    })
    // downvoting an answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    })

    revalidatePath(path)
  } catch (error) {
    console.error('Error downvoting answer:', error)
    throw error
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase()

    // destructure params to extract questionId and path
    const { answerId, path } = params

    // find answer to remove by its ID
    const answer = await Answer.findById(answerId)

    // if there is no answer
    if (!answer) {
      throw new Error('Answer not found')
    }

    // if there is an answer
    await answer.deleteOne({ _id: answerId })

    // delete one question by its ID
    await Question.updateMany(
      { _id: answer.question },
      {
        $pull: {
          answers: answerId,
        },
      },
    )

    // delete all answers associated with the question
    await Interaction.deleteMany({ answer: answerId })

    // revalidate path so the question is automatically removed from the home page without refreshing
    revalidatePath(path)
  } catch (error) {
    console.error('Error deleting question:', error)
    throw error
  }
}
