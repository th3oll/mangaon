import "./loadEnv.js";

import { MongoClient } from "mongodb";
const connectionString = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.jmarl.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGODB_CLUSTER}`;

const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
let db = conn.db("mangaon");
// Ping the database to check if it's connected
let pong = await db.command({ ping: 1 });
console.log(pong);
export default db;