'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import Tag from '@/database/tag.model'
import { CreateQuestionParams, GetQuestionsParams } from './shared.types'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase()
    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 })

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
