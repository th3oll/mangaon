import express from 'express';
import db from './mongoConnect.js';
const app = express()
const port = 3000

app.get("/getChapters", async (req, res) => {
    let results = await db.collection("chapters").find({}).toArray()
    console.log(results);
    res.send(results).status(200);
  });

app.get("/getChapters/:id", async (req, res) => {
    let results = await db.collection("chapters").findOne({chapterId: req.params.id})
    console.log(results);
    res.send(results).status(200);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})