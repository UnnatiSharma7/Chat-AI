# 💬 Chat-AI (ChatGPT Clone)

Chat-AI is a full-stack conversational AI application built with the **MERN stack** and powered by the **Google Gemini API**.  
It replicates the ChatGPT experience with a modern UI, secure authentication, and persistent chat history.

---

## 🚀 Features

- 🔐 **User Authentication with Clerk**  
- 🧠 **AI Conversations using Google Gemini API**  
- 💾 **Persistent Chat History (MongoDB backend)**  
- 🖼️ **Image Uploads & optimization with ImageKit**  
- 📝 **Markdown Rendering for AI responses**  
- ⚡ **React Query for smooth data fetching & caching**  
- 🎨 **Modern UI with React, TailwindCSS & animations**

---

## 🛠️ Tech Stack

### Frontend
- React 18  
- React Router DOM  
- React Query (`@tanstack/react-query`)  
- React Markdown  
- Tailwind CSS  
- Clerk (Authentication)  
- ImageKit React SDK  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Clerk Middleware  
- Google Gemini API  

---

## ⚙️ Environment Variables

### Frontend (`client/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
VITE_GEMINI_PUBLIC_KEY=your_gemini_api_key
VITE_API_URL=http://localhost:3000
```
### Backend (`Backend-Server/.env`)
```
IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key

CLIENT_URL=http://localhost:5173
MONGO=your_mongo_connection_uri

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

PORT=3000
```
---

## ▶️ Getting Started

### Clone the repository:
```
git clone https://github.com/your-username/Chat-AI.git
cd Chat-AI
```

### Start Backend
```
cd Backend-Server
npm install
npm run dev
```

### Start Frontend
```
cd client
npm install
npm run dev
```

## 📸 Screenshots
<img width="2515" height="1108" alt="image" src="https://github.com/user-attachments/assets/a7ba41a0-1f84-47c1-bc1b-06cb19ca9c47" />
<img width="2517" height="1118" alt="image" src="https://github.com/user-attachments/assets/b18bef89-c43a-4a66-83ea-51de201f2269" />
<img width="2524" height="1116" alt="image" src="https://github.com/user-attachments/assets/064bab77-aedd-49b8-b56f-5f31408eb72b" />

## 📜 License

- 📄 **MIT License**
- ✅ **Free to use, modify, and distribute**
- 👨‍💻 **Attribution required – Credit the original author**
