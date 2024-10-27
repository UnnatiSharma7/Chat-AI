import express from "express";
import ImageKit from "imagekit";
import cors from 'cors';
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { ObjectId } from "mongodb";


const port= process.env.PORT || 3000
const app= express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}));

app.use(express.json({limit:'100mb'}));

const connect =async ()=>{
  try{
   await mongoose.connect(process.env.MONGO)
   console.log("connected to mongoDB ")
  }catch(err){
console.log(err);
  }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
  });

app.get("/api/upload",(req,res)=>{
    const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats",ClerkExpressRequireAuth({}),async (req, res) => {
  const {text } = req.body;
  const userId=req.auth.userId;
  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
      res.status(201).send(newChat._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userChats",ClerkExpressRequireAuth(),async(req,res)=>{
const userId=req.auth.userId;
try{
const userChats=  await UserChats.find({userId:userId});
res.status(200).send(userChats[0].chats);
}
catch(err){
console.log(err);
res.status(500).send("Error fetching userChats!");
}
});

app.get("/api/chats/:id",ClerkExpressRequireAuth(),async(req,res)=>{
  const userId=req.auth.userId;
  try{
    const chat = await Chat.findOne({_id:req.params.id, userId }); 
   res.status(200).send(chat);
  }
  catch(err){
  console.log(err);
  res.status(500).send("Error fetching userChats!");
  }
  });

  app.put("/api/chats/:id",ClerkExpressRequireAuth(),async (req,res)=>{
    const userId = req.auth.userId;
    const {question,answer,img}=req.body;
    // console.log(answer);
    const newItems=[
  ...(question?
    [{role:"user",parts:[{text:question}],...(img && {img})}]:
[]),
  {role:"model",parts:[{text:answer}]},
];

    try{
      const updatedChat = await 
      await Chat.findOneAndUpdate(
        { _id: req.params.id, userId },
        {
          $push: {
            history: {
              $each: newItems,
            },
          },
        },
        { new: true } // Return the updated document
      );
      res.status(200).send(updatedChat);
    }catch(err){
      console.log(err);
      res.status(500).send("Error adding conversation!");
      }
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated!");
  });

app.listen(port,()=>{
  connect()
    console.log("Server is running on 3000");
})