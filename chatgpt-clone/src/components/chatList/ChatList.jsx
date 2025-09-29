import React from 'react'
import './chatList.css'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from "@clerk/clerk-react";


const ChatList = () => {

  const { getToken } = useAuth();

const { isPending, error, data } = useQuery({
  queryKey: ["userChats"],
  queryFn: async () => {
    const token = await getToken();
    // console.log("🔑 token from Clerk:", token);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`,
       {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
       }
     );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error ${res.status}: ${text}`);
    }

    return res.json();
  },
});
  console.log("backend url is:",import.meta.env.VITE_API_URL);

  return (
    <div className="chatList">
        <span className='title'>DASHBOARD</span>
        <Link to="/dashboard" >Create a new Chat</Link>
        <Link to="#" style={{ cursor: "not-allowed" }}>Explore Chat AI</Link>
        <Link to="#" style={{ cursor: "not-allowed" }}>Contact</Link>
        <hr />
        <span className="title">RECENT CHATS</span>
        <div className="list">
            {  isPending?"Loading...":
            error?"Something went wrong!":
              data?.map(chat=>(
                <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>{chat.title}
                </Link>
              ))
            }
        </div>
        <hr />
        <div className="upgrade">
            <img src="/logo.png" alt="" />
            <div className="texts" style={{ cursor: "not-allowed" }}>
                <span>Upgrade to Chat AI pro</span>
                <span>Get unlimited acess to all features</span>
            </div>
        </div>
    </div>
  )
}

export default ChatList