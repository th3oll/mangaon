import express from 'express';
import cors from 'cors';
import db from './mongoConnect.js';


const COLLECTION_NAME = "playlists";
const app = express()
const port = 3000

app.use(cors())

// Methods to allow the frontend to get playlists

app.get("/getPlaylists", async (req, res) => {
  try {
    let results = await db.collection(COLLECTION_NAME).find({}).toArray();
    console.log(results);
    res.send(results).status(200);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getPlaylists/:chapterId", async (req, res) => {
  try {
    let results = await db.collection(COLLECTION_NAME).find({chapterId: req.params.chapterId}).toArray();
    console.log(results);
    res.send(results).status(200);
  } catch (error) {
    console.error("Error fetching playlist with specific id:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Methods to create, update, and delete playlists

app.post("/createPlaylist", async (req, res) => {
  try {
    const { chapterId, name, description, creator } = req.body;
    if (!chapterId || !name || !description || !creator) {
        return res.status(400).send("Missing required fields");
    }

    const playlist = {
        chapterId,
        name,
        description,
        creator,
        rating,
        songs: [] // Initialize with an empty array of tracks
    };

    let result = await db.collection(COLLECTION_NAME).insertOne(playlist);
    console.log(result);
    res.send(result).status(201);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/updatePlaylist/:playlistId", async (req, res) => {
  try {
    const { name, description, songs } = req.body;
    if (!name && !description && !rating && !songs) {
        return res.status(400).send("No fields to update");
    }

    let updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (rating) updateFields.rating = rating;
    if (songs) updateFields.songs = songs;

    let result = await db.collection(COLLECTION_NAME).updateOne(
        { _id: req.params.playlistId },
        { $set: updateFields }
    );
    console.log(result);
    res.send(result).status(200);
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})