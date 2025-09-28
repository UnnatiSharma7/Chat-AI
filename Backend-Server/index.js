import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ClerkExpressWithAuth, ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
});

// ----------------- CORS -----------------
app.use(cors({
  origin: process.env.CLIENT_URL, // e.g., http://localhost:5173
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // <-- ADD THIS LINE
}));
console.log("Allowed origin:",process.env.CLIENT_URL);

// ----------------- JSON -----------------
app.use(express.json({ limit: "100mb" }));

// ----------------- Clerk Middleware -----------------
app.use(ClerkExpressWithAuth()); // MUST be before protected routes

// ----------------- MongoDB Connection -----------------
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

// ----------------- Health Route -----------------
app.get("/test", (req, res) => res.send("Backend working ✅"));

// ----------------- Routes -----------------

// GET all user chats
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    // console.log("🔎 req.auth:", req.auth);
    const userId = req.auth.userId;

    const userChats = await UserChats.findOne({ userId });
    if (!userChats) return res.status(200).json([]); // no chats yet

    res.status(200).json(userChats.chats);
  } catch (err) {
    console.error("❌ /api/userchats error:", err);
    res.status(500).send("Error fetching userChats!");
  }
});

// POST a new chat
app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const { text } = req.body;
  const userId = req.auth.userId;

  try {
    // Create chat
    const newChat = new Chat({
      userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // Update UserChats
    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      const newUserChats = new UserChats({
        userId,
        chats: [{ _id: savedChat._id, title: text.substring(0, 40) }],
      });
      await newUserChats.save();
    } else {
      await UserChats.updateOne(
        { userId },
        { $push: { chats: { _id: savedChat._id, title: text.substring(0, 40) } } }
      );
    }
    res.status(201).json(savedChat._id);
  } catch (err) {
    console.error("❌ /api/chats POST error:", err);
    res.status(500).send("Error creating chat!");
  }
});

// GET a single chat by ID
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (!chat) return res.status(404).send("Chat not found");

    res.status(200).json(chat);
  } catch (err) {
    console.error("❌ /api/chats/:id error:", err);
    res.status(500).send("Error fetching chat!");
  }
});

// PUT update chat
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }] : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $push: { history: { $each: newItems } } },
      { new: true }
    );

    res.status(200).json(updatedChat);
  } catch (err) {
    console.error("❌ /api/chats/:id PUT error:", err);
    res.status(500).send("Error updating chat!");
  }
});

app.get("/api/upload", (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});

// ----------------- Error Handler -----------------
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).send(err.message || "Server Error");
// });

// ----------------- Start Server -----------------
app.listen(port, () => {
  connect();
  console.log(`🚀 Server running on port: ${port}`);
});
