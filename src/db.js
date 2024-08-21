import { MongoClient } from "mongodb";
let db;
async function connectToDB(cb) {
    // const url = "mongodb://localhost:27017"
    const url = "mongodb+srv://asatvik1958:rwOWuD1XUmDyB7b6@hackdb.tylq0.mongodb.net/?retryWrites=true&w=majority&appName=HackDb";
    const client = new MongoClient(url);
    await client.connect();
    db = client.db("HackDb");
    cb();
}

// connectToDB()

export { connectToDB, db };