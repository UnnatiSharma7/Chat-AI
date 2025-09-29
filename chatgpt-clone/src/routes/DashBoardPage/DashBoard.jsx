import './dashboard.css'
import {  useMutation, QueryClient } from '@tanstack/react-query'
// import { useNavigate } from 'react-router-dom'
// import { ListModels } from '../../lib/listModels';
import { useAuth } from "@clerk/clerk-react";

const DashBoard = () => {

  // const navigate= useNavigate();
  const queryClient = new QueryClient();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (text) => {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      })
      console.log("dashboard url is:",import.meta.env.VITE_API_URL);
      return await res.json();
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userChats'] });
      // navigate(`/dashboard/chats/${id}`);
    },
  });

const handleSubmit= async(e)=>{
  e.preventDefault();
  const text=e.target.text.value;
  if(!text)return ;
 mutation.mutate(text);
};

  return (
    <div className='dashboardPage'>
      <div className="texts" style={{cursor:"not-allowed"}} >
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>CHAT AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit} >
          <input name="text" type="text" placeholder='Ask me anything...'/>
          <button>
            <img src="../../arrow.png" alt="" />
          </button>
        </form>
      </div>
      <span className="chat-notify">Chat AI can make mistakes. Check important info.</span>
    </div>
  )
}

export default DashBoard