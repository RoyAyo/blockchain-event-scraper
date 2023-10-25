import mongoose from 'mongoose'

const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_TEST_URI
    : process.env.MONGO_URI

mongoose.Promise = global.Promise

const db = mongoose
  .connect(MONGO_URI || 'mongodb://127.0.0.1:27017/extract-blocks')
  .then(() => {
    console.log('Connected successfully to Database')
  })
  .catch((e: Error) => {
    console.log(e)
  })

export default db