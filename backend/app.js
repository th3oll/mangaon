import express from 'express';
import db from './mongoConnect.js';
const COLLECTION_NAME = "playlists";
const app = express()
const port = 3000

app.get("/getPlaylists", async (req, res) => {
    let results = await db.collection(COLLECTION_NAME).find({}).toArray();
    console.log(results);
    res.send(results).status(200);
  });

app.get("/getPlaylists/:chapterId", async (req, res) => {
    let results = await db.collection(COLLECTION_NAME).find({chapterId: req.params.chapterId}).toArray();
    console.log(results);
    res.send(results).status(200);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})