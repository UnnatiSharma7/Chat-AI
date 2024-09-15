import React ,{useRef,useEffect, useState}from 'react'
import './newPrompt.css'
import Upload from '../upload/Upload';
import model from '../../lib/Gemini'
import Markdown from 'react-markdown'
import { IKImage } from 'imagekitio-react';

const NewPrompt = () => {

  const [img,setImg]=useState({
    isLoading:false,
    error:"",
    dbData:{},
    aiData:{},
  })

    const endRef=useRef(null);
    const [question,setQuestion]= useState("");
    const [answer,setAnswer]=useState("");


    useEffect(()=>{
      endRef.current.scrollIntoView({behavior:"smooth"});
    },[answer,question,img.dbData]);

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });


    const add= async (text)=>{
       setQuestion(text);
      const result = await chat.sendMessageStream
      (Object.entries(img.aiData).length ? [img.aiData,text]:[text]);
      let accumulatedText="";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
  
      setImg({
        isLoading:false,
        error:"",
        dbData:{},
        aiData:{},
      });
    }

    const handleSubmit=(e)=>{
      e.preventDefault();
  
      const text=e.target.text.value;
      if(!text) return;
  
      add(text);
  
     }

  return (
    <>   
        {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
        <div className="endChat" ref={endRef}></div>
        <form className='newForm' onSubmit={handleSubmit}>
         <Upload setImg={setImg}></Upload>

            <input type="file" id="file" multiple={false} hidden />
            <input type="text" name="text" placeholder='Ask Anything...' />
            <button>
                <img src="/arrow.png" alt="" />
            </button>
        </form>
        
    </>
  )
}

export default NewPrompt