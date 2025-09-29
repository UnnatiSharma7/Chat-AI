import {useRef,useEffect, useState}from 'react'
import './newPrompt.css'
import Upload from '../upload/Upload';
import model from '../../lib/Gemini'
import Markdown from 'react-markdown'
import { IKImage } from 'imagekitio-react';
import { useAuth } from "@clerk/clerk-react";
import { useMutation, QueryClient } from '@tanstack/react-query';

const NewPrompt = ({data}) => {

  const [img,setImg]=useState({
    isLoading:false,
    error:"",
    dbData:{},
    aiData:{},
  })

    const { getToken } = useAuth();

    const endRef=useRef(null);
    const formRef=useRef(null);
    const [question,setQuestion]= useState("");
    const [answer,setAnswer]=useState("");
    
    
    useEffect(()=>{
      endRef.current.scrollIntoView({behavior:"smooth"});
    },[data,answer,question,img.dbData]);

    const queryClient = new QueryClient();

    const mutation = useMutation({
      mutationFn: async() => {
        const token = await getToken(); 
        return await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: question.length ? question : undefined,
            answer,
            img: img.dbData?.filePath || undefined,
          }),
        }).then((res) => res.json());
      },
      onSuccess: () => {
        queryClient
          .invalidateQueries({ queryKey: ["chat", data._id] })
          .then(() => {
            formRef.current.reset();
            // window.location.reload();
          });
      },
      onError: (err) => {
        console.log(err);
      },
    });
  

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
 

    const add= async (text,isInitial)=>{
      if(!isInitial) setQuestion(text);

       try{
        const result = await chat.sendMessageStream(
          Object.entries(img.aiData).length ? [img.aiData, text] : [text]
        );
        let accumulatedText = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          // console.log(chunkText);
          accumulatedText += chunkText;
          setAnswer(accumulatedText);
        }
        mutation.mutate();
    }catch(err){
      console.log(err);
    } 
    }

    const handleSubmit=(e)=>{
      e.preventDefault();
  
      const text=e.target.text.value;
      if(!text) return;
  
      add(text,false);
  
     };

 // we don't need this in production
     const hasRun=useRef(false);
     useEffect(()=>{
      if(!hasRun.current){
      if(data?.history?.length===1){
        add(data.history[0].parts[0].text,true);
      }}
      hasRun.current=true;
     },[]);
    

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
        <form className='newForm' onSubmit={handleSubmit} ref={formRef}>
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