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

function generateRandomCode() {
  return Math.floor(10000 + Math.random() * 90000);
}


mongoose.connect(process.env.MONGO_URI, )
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get('/',(req,res)=>{
  res.send("<h1>Hello Blog User</h1>")
})

app.post('/reactpost',async(req,res)=>{
    try {
      
      const Blog={
        code:generateRandomCode(),
        title:req.body.title,
        content:req.body.content,
        author:req.body.author
      }
      
        const newPost = new Post(Blog);
        await newPost.save();
        res.status(201).json({ message: "Post saved to MongoDB!",blog:Blog });
        
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
  
app.post('/edit', async (req, res) => {
  const id = req.body.postid;
  

  // Optional: Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const post = await Post.findById(id); // simpler than using find({ _id: ... })
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/delete',async(req,res)=>{
  const id = req.body.postid;
  

  // Optional: Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const post = await Post.findByIdAndDelete(id);; // simpler than using find({ _id: ... })
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: "Post Deleted" });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'Not Deleted' });
  }
})

app.patch('/update-post/:id',async(req,res)=>{
  try {
    const postId = req.params.id;
    const updatedData = req.body;
    

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error });
  }
})

app.post('/verify',async(req,res)=>{
 const {code,blogid}=req.body
 try{
  const post = await Post.findById(blogid); // simpler than using find({ _id: ... })
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
else{
  if(post.code==code){
    res.send({Message:"User Confirmed"})
  }
  else{
    res.send({Message:"User Not Confirmed"})
  }
}
 }catch(error){
 res.send({Message:"Error"})
 }
 
})

app.listen(port,()=>{
    console.log(`Server is Running on : http://localhost:${port}`)
})