'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import { SearchParams } from './shared.types'
import Answer from '@/database/answer.model'
import User from '@/database/user.model'
import Tag from '@/database/tag.model'

const SearchableTypes = ['question', 'answer', 'user', 'tag']

export async function globalSearch(params: SearchParams) {
  // fetch all data all at once global search
  try {
    await connectToDatabase()

    const { query, type } = params
    // turn query into regular expression to filter the db
    const regexQuery = { $regex: query, $options: 'i' }

    let results = []

    const modelsAndTypes = [
      { model: Question, searchField: 'title', type: 'question' },
      { model: Answer, searchField: 'content', type: 'answer' },
      { model: User, searchField: 'name', type: 'user' },
      { model: Tag, searchField: 'name', type: 'tag' },
    ]

    const typeLower = type?.toLowerCase()

    // if no filter is specified search across everything
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // SEARCH EVERYTHING

      // cannot use async with . map or foreach so we must destruct the array
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery }) // search the db for the query
          .limit(2) // limit the results to 2

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === 'answer'
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === 'user'
                ? item.clerkid
                : type === 'answer'
                ? item.questionId
                : item._id,
          })),
        )
      }
    } else {
      // SEARCH IN THE SPECIFIED MODEL TYPE ONLY
      const modelInfo = modelsAndTypes.find((item) => item.type === type)

      console.log({ modelInfo, type })
      if (!modelInfo) {
        throw new Error('invalid search type')
      }
      const queryResults = await modelInfo.model // abstraction for the model
        .find({ [modelInfo.searchField]: regexQuery }) // search the db for the query
        .limit(8) // limit the results to 8

      results = queryResults.map((item) => ({
        title:
          type === 'answer'
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === 'user'
            ? item.clerkid
            : type === 'answer'
            ? item.questionId
            : item._id,
      }))
    }

    return JSON.stringify(results)
  } catch (error) {
    console.log(`error fetching global results: ${error}`)
    throw error
  }
}
