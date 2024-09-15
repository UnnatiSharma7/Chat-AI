import React from 'react'
import './chatpage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt';
const ChatPage = () => {

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message">Test message ai</div>
          <div className="message user">Test message user</div>
          <div className="message">Test message ai</div>
          <div className="message user">Test message user</div>
          <div className="message">Test message ai</div>
          <div className="message user">Test message user</div>
          <div className="message">Test message ai</div>
          <div className="message user">Test message user</div>
          <div className="message">Test message ai</div>
          <div className="message user">Test message user</div>
          <div className="message">Test message ai</div>
          <div className="message user">Test message user</div>
          <div className="message">Test message ai</div>
          <div className="message user">Test message user</div>
          <div className="message">Test message ai</div>
          <div className="message user">Test message user</div>
          <NewPrompt></NewPrompt>
          
        </div>
      </div>
    </div>
  )
}

export default ChatPage