'use server'

import {
  GetQuestionByIdParams,
  CreateQuestionParams,
  GetQuestionsParams,
  QuestionVoteParams,
  DeleteQuestionParams,
  EditQuestionParams,
} from './shared.types.d'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import Tag from '@/database/tag.model'

import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import Answer from '@/database/answer.model'
import Interaction from '@/database/interaction.model'
import { FilterQuery } from 'mongoose'

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase()

    const { searchQuery, filter } = params // destructure searchQuery from params

    const query: FilterQuery<typeof Question> = {}

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ]
    }

    // get questions by filter
    let sortOptions = {} // empty object to store sort options

    switch (filter) {
      case 'newest': // sort by createdAt in descending order
        sortOptions = { createdAt: -1 }

        break
      case 'frequent': // sort by views in descending order
        sortOptions = { views: -1 }

        break
      case 'unanswered': // get questions with no answers
        query.answers = { $size: 0 }

        break
      default:
        break
    }

    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort(sortOptions) // sort the questions by the sort options

    return { questions }
  } catch (error) {
    console.error('Error getting questions:', error)
    throw error
  }
}
export async function createQuestion(params: CreateQuestionParams) {
  // eslint-disable-next-line no-empty
  try {
    // Connect to the database
    connectToDatabase()

    // Destructure parameters to extract required fields
    const { title, content, tags, author, path } = params

    // Create a new question document
    const question = await Question.create({
      title,
      content,
      author,
    })

    // Initialize an array to store tag document IDs
    const tagDocuments = []

    // Iterate over each tag in the tags array
    for (const tag of tags) {
      // Find the tag by name (case-insensitive) and update it if it exists,
      // or create a new tag if it doesn't (upsert option)
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } }, // Case-insensitive search for the tag name
        {
          $setOnInsert: { name: tag }, // Set the name if the tag is being created
          $push: { questions: question._id }, // Push the question ID to the tag's questions array
        },
        { upsert: true, new: true }, // Create the tag if it doesn't exist, and return the new document
      )
      // Push the tag document ID to the array
      tagDocuments.push(existingTag._id)
    }

    // update the question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    })

    // create an interaction record for the user's ask_question action

    // increment authors reputation by 5 for creating question

    // revalidate path so the question is automatically displayed without refreshing the home page after creation

    revalidatePath(path)
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error creating question:', error)
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase()
    const { questionId } = params

    const question = await Question.findById(questionId)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      })

    return question
  } catch (error) {
    console.error('Error getting question by ID:', error)
    throw error
  }
}

export async function upVoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase()
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    })
    if (!question) {
      throw new Error('Question not found')
    }

    // Increment author's reputation by +10 for upvoting a question

    revalidatePath(path)
  } catch (error) {
    console.error('Error upvoting question:', error)
    throw error
  }
}

export async function downVoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase()
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    })
    if (!question) {
      throw new Error('Question not found')
    }

    // Increment author's reputation by +10 for upvoting a question

    revalidatePath(path)
  } catch (error) {
    console.error('Error downvoting question:', error)
    throw error
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase()

    // destructure params to extract questionId and path
    const { questionId, path } = params

    // delete one question by its ID
    await Question.deleteOne({ _id: questionId })

    // delete all answers associated with the question
    await Answer.deleteMany({ question: questionId })

    // delete all interactions related to the question
    await Interaction.deleteMany({ question: questionId })

    // delete tags associated with the question
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
    )

    // revalidate path so the question is automatically removed from the home page without refreshing
    revalidatePath(path)
  } catch (error) {
    console.error('Error deleting question:', error)
    throw error
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase()

    // destructure params to extract questionId and path
    const { questionId, title, content, path } = params

    const question = await Question.findById(questionId).populate('tags')

    if (!question) {
      throw new Error('Question not found')
    }

    question.title = title
    question.content = content

    await question.save() // save the updated question

    // revalidate path so the question is automatically removed from the home page without refreshing
    revalidatePath(path)
  } catch (error) {
    console.error('Error deleting question:', error)
    throw error
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase()

    // get hot questions by sorting by views and upvotes in descending order and limit to 5
    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5)

    return hotQuestions
  } catch (error) {
    console.log(error)
    throw error
  }
}
