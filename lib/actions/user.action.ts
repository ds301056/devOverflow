'use server'

import { connectToDatabase } from '../mongoose'

export async function getUserById(params) {
  try {
    connectToDatabase()
    const { userId } = params

    const user = await userId.findOne({ clerkId: userId })

    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}
