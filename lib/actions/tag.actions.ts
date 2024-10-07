'use server'

import User from '@/database/user.model'
import { connectToDatabase } from '../mongoose'
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from './shared.types'
import Tag, { ITag } from '@/database/tag.model'
import Question from '@/database/question.model'
import { FilterQuery } from 'mongoose'

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase()

    const { userId } = params
    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    // Find interactions for the user and group by tags...

    // Interaction

    // statically return tags for now
    return [
      { _id: '1', name: 'tag' },
      { _id: '2', name: 'tag2' },
    ]
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase()

    // pass params : search query, filter
    const { searchQuery, filter, page = 1, pageSize = 20 } = params
    const skipAmount = (page - 1) * pageSize // skip over the previous pages

    const query: FilterQuery<typeof Tag> = {}

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }]
    }

    // sort options
    let sortOptions = {}

    switch (filter) {
      case 'popular':
        sortOptions = { questions: -1 } // most questions tagged - descending
        break
      case 'recent':
        sortOptions = { createdAt: -1 } // newest
        break
      case 'name':
        sortOptions = { name: 1 } // alphabetical
        break
      case 'old':
        sortOptions = { createdAt: 1 } // oldest
        break

      default:
        break
    }

    const totalTags = await Tag.countDocuments(query) // pass the tags amount

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const isNext = totalTags > skipAmount + tags.length

    return { tags, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase()

    const { tagId, page = 1, pageSize = 10, filter, searchQuery } = params
    const skipAmount = (page - 1) * pageSize

    const tagFilter: FilterQuery<ITag> = { _id: tagId }

    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1, // +1 to check if next page exists
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ],
    })

    if (!tag) {
      throw new Error('Tag not found')
    }

    const isNext = tag.questions.length > pageSize // check if next page exists

    const questions = tag.questions

    return { tagTitle: tag.name, questions, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase()

    // get tag name and total questions count for each tag
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } }, // descending order of number of questions
      { $limit: 5 }, // get top 5 tags
    ])

    return popularTags
  } catch (error) {
    console.log(error)
    throw error
  }
}
