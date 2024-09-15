import React from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import './dashboardLayout.css'
import {useAuth} from "@clerk/clerk-react"
import {useEffect} from "react"
import ChatList from '../../components/chatList/ChatList'

const DashBoardLayout = () => {

  const {userId,isLoaded}= useAuth()
  const navigate= useNavigate()

useEffect(()=>{
  if(isLoaded && !userId){
    navigate("/sign-in");
  }
},[isLoaded,userId,navigate]);

if(!isLoaded) return "Loading...";

  return (
    <div className='dashboardLayout'>
      <div className="menu"><ChatList></ChatList></div>
      <div className="content"><Outlet></Outlet></div>
    </div>
  )
}

export default DashBoardLayout