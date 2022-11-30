import { MongoClient } from "mongodb";

const host = 'localhost'
const port = '27017'

const uri = `mongodb://${host}:${port}`
export const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

await client.connect()
const db = client.db("coderhouse")
export const dbChat = db.collection("chat")
await client.close()