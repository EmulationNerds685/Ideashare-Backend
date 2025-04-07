import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/post.js';
dotenv.config();

const port=process.env.PORT
const app=express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, )
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get('/',(req,res)=>{
  res.send("<h1>Hello Blog User</h1>")
})

app.post('/reactpost',async(req,res)=>{
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json({ message: "Post saved to MongoDB!" });
        console.log(req.body)
      } catch (error) {
        res.status(500).json({ message: "Failed to save post", error });
      }
})

app.get('/post', async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }); // newest first
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch posts", error: err });
    }
  });
  

app.listen(port,()=>{
    console.log(`Server is Running on : http://localhost:${port}`)
})