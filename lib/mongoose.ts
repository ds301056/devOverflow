import mongoose from 'mongoose'

let isConnected: boolean = false

export const connectedToDatabase = async () => {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URL) {
    return console.log('MISSING MONGODB_URL')
  }
  if (isConnected) {
    console.log('Mongo is already connected')
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'devOverflow',
    })
    isConnected = true
    console.log('Mongo connected')
  } catch (error) {
    console.log('Mongo connection failed')
  }
}
