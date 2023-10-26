import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI;

mongoose.Promise = global.Promise

const db = mongoose
  .connect(MONGO_URI || 'mongodb://127.0.0.1:27017/scrape-blocks')
  .then(() => {
    console.log('Connected successfully to Database')
  })
  .catch((e: Error) => {
    console.log(e)
  })

export default db