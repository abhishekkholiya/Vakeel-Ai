import styles from '../../styles/chatRoom.module.css';
import { useState, useRef } from 'react';
import Head from 'next/head';
import { GoogleGenAI, GoogleGenerativeAI } from "@google/genai";
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as motion from 'motion/react-client';

import useVoiceRecognition from '@/hooks/useVoiceRecognition';


const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API });
export default function Chat(){

    const {startListening,stopListening,listening,transcription} = useVoiceRecognition();

    const router = useRouter();
    const [query,setQuery] = useState('');
    const [messages,setMessages] = useState(null);
    const [cases,setCases] = useState(null);
    const [popUp,setPopUp] = useState(false);
    const [userData,setUserData] = useState(null);
    const [conversations,setConversations] = useState(null);
    const [selectedFile,setSelectedFile] = useState(null);
    const [transcript,setTranscript] = useState('Hi Vakeel');

    const recognitionRef = useState(null);
    const [draftScreen,setDraftScreen] = useState(false);
    

    const [voiceMode,setVoiceMode] = useState(false);

    const [disableInput,setDisableInput] = useState(false);

    const [showFile,setShowFile] = useState(false);

    const [mute,setMute] = useState(false);

    const [legalDraftMessages,setLegalDraftMessages] = useState(null);

    const [searchDraft,setSearchDraft] = useState('');

    const [draftFile,setDraftFile] = useState(null);

  
    const {user} = useAuth();
    let {chat} = router.query;

    const fileRef = useRef();
    const chatDivRef = useRef();

    const draftFileRef = useRef();


    useEffect( ()=>{   

        
        const getUser = async ()=>{
            if(user){
            
                const [userDataResponse] = await Promise.all([
                    fetch(`/api/users/getuser?userUID=${user.uid}`),
                ]);
                const userData = await userDataResponse.json();
                if(userDataResponse.ok && user){
                    router.push(`/research/${chat}`);
                    setUserData(userData);
                }else{
                    router.push("/SignUp");
                } 
            }
        }
        getUser();


    },[chat]);

    useEffect(()=>{

        const getConversations = async ()=>{

            const conversationResponse = await fetch(`/api/conversations/fetchconversation?userUID=${user.uid}`);
            const conversationsData = await conversationResponse.json();
            if(conversationResponse.ok && conversationsData){
                setConversations(conversationsData.conversations);
            }
        }

        getConversations();
    },[chat]);

    useEffect(()=>{

        const getMessages = async()=>{
         
            const messageResponse = await fetch(`/api/messages/fetchmessage?conversationID=${chat}`);
            const messagesData = await messageResponse.json();
         
            if(messageResponse.ok && messagesData){
                setMessages(messagesData.messages);

                // console.log('opening an existing conversation',chat);
               
            }
        }

        getMessages();

    },[chat]);


    useEffect(()=>{
        if(chatDivRef.current && chatDivRef.current.scrollHeight){
              chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight ;
        }
    },[messages,query]);


    // //function for detecting user intent
    // const detectIntent = async (prompt)=>{


    //     const intentResponse = await genAI.models.generateContent({
    //         model: "gemini-2.0-flash",
    //         contents: `classify the intent of the following request into (general query and, find legal case related query) use one word only ${prompt}`,
    //     });

    //     let intentText = intentResponse.text;
    //     return intentText;


    // }


    //new function for intent detection powered by gpt
    const intentDetection = async (prompt)=>{
      
        let response =  await fetch(`/api/agent/getintent?query=${prompt}`);
        let data = await response.json();
        // console.log(data);
        return data.intent;
    }


    
    //saves messages to the db
    const saveMessage = async (content,sender,viewMore)=>{


        let messageData;
    

        //new conversation
        if((chat === 'newchat' || chat === 'chat') && sender === 'human'){

                    
                    // console.log('creating a new conversation');

                    let  newData = {
                        title:`${content}`,
                        language:'english',
                        userUID:userData.user.firebaseUid
                        
                    } 
            
                    const response = await fetch('/api/conversations/addconversation', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title:newData.title,
                            language:newData.language,
                            userUID:newData.userUID
                        }),
                    });



                    let conversationData = await response.json();


                    let messageData = {
                        conversationID:conversationData.conversation._id,
                        userUID:conversationData.conversation.userUID,
                        sender:sender,
                        file:'',
                        type:'text',
                        messageTime: new Date(),
                        content:content
                    };
                    const messageResponse = await fetch('/api/messages/addmessage', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(messageData),
                    });

                    router.push(`/research/${conversationData.conversation._id}`, undefined, { shallow: true });

                    chat = conversationData.conversation._id;


                    let conversationsArray;


                    if(conversations !== null) { 
                        conversationsArray = conversations; 

                        conversationsArray.push({
                            title:`${content}`,
                            _id:conversationData.conversation._id,
                            language:conversationData.conversation.language,
                            timestamp:conversationData.conversation.timestamp,
                            userUID:newData.userUID
            
            
                        });

                        setConversations(conversationsArray);
                    }else{

                    
                        conversationsArray = [{
                            title:`${content}`,
                            _id:conversationData.conversation._id,
                            language:conversationData.conversation.language,
                            timestamp:conversationData.conversation.timestamp,
                            userUID:newData.userUID
            
            
                        }];
                        // console.log("converstaions array",conversationsArray);

                        setConversations(conversationsArray);
                    }


                    //updated data
                    // console.log('updating current conversation',conversationData.conversation._id);
                  

        }else{

            // console.log('using an existing conversation',chat); 

            messageData = {
                conversationID:chat,
                userUID:userData.user.firebaseUid,
                sender:sender,
                file:'',
                type:'text',
                messageTime: new Date(),
                content:content,
                viewMore:viewMore
            };

            const response = await fetch('/api/messages/addmessage', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });


        }






    }


    
    //queries the particular case
    const queryCase = async (query)=>{

       
        const casesDB = await fetch(`/api/fetchCases?query=${query}`);
        const data = await casesDB.json();
    

        // responsible for summarization
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `summarise this in very short paragraphs (no markdown & no bold text) - ${data.doc}`,
        });
        
    
        const result =  response.text;

        let newResult = 
        `
            From: <Strong>${data.docsource}</Strong> <br/>
            Title: <Strong>${data.title}</Strong> <br/>
            Summary: <br/>
            ${result}
        `;


        //updates the cases record
        let newCases = cases;

        if(cases !== null && Array.isArray(cases)){
            newCases = [...cases,data];
        }else{
            newCases = [data];
        }
        setCases(newCases);

        return newResult;
                      
    }



    //query the ai
    const queryAI = async (prompt)=> {
        
        try{

         
            // console.log("trying to query the ai");

            let gptIntent = await intentDetection(prompt);
            let normalizedIntent = gptIntent.toLowerCase();

            let viewMore = false;
            // console.log('gpt said:',normalizedIntent);

            if(normalizedIntent === 'general query'){
            
                let generalResponse;

                    //checking if user has added a file
                    if(selectedFile !== null){
                        setShowFile(false);

                        const { default: pdfToText } = await import('react-pdftotext');

                        const text = await pdfToText(selectedFile);

                        generalResponse = await genAI.models.generateContent({
                            model: "gemini-2.0-flash",
                            contents: `response to this in few lines -  ${prompt} pdf: ${text}`,
                        });
                    
                        setSelectedFile(null);
                        
                    
                    
                    }else{
                        generalResponse = await genAI.models.generateContent({
                            model: "gemini-2.0-flash",
                            contents: `response to this in few lines -  ${prompt}`,
                        });
                    }



                //answer from the LLM
                let generalText = generalResponse.text;

                let newMessages = messages;
                let savedMessages = await saveMessage(generalText,'ai',viewMore);



                if(messages !== null){
 
                    //when messages array is not null
                    setMessages( prev=> [...prev,{ content: generalText, sender: 'ai' }]);
                }else{
                    
                    newMessages = [{content:prompt,sender:'human'},{content:generalText,sender:'ai',viewMore:viewMore}];
                    setMessages(newMessages);

                }
                
                setDisableInput(false);
                return generalText;
                // return setMessages(newMessages);



    
            }else if (normalizedIntent=== 'fetch case'){

                viewMore = true;

                //getting the specfic kind of case
                let legalResponse = await genAI.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: `find the legal words from the prompt only (example - divorce case) no extra words -  ${prompt}`,
                });

                let legalText =  legalResponse.text;

                let caseResult = await queryCase(legalText);
             
                
                let savedMessages = await saveMessage(caseResult,'ai',viewMore);
         

                let newMessages;
                if(messages !== null){
                   
                    setMessages( prev=> [...prev,{ content: caseResult, sender: 'ai',viewMore:viewMore }]);
                }else{
                   
                    newMessages = [{content:prompt,sender:'human'},{content:caseResult,sender:'ai',viewMore:viewMore}];
                    setMessages(newMessages);
                }

                // console.log("newCases that was set:", newCases); 
                setDisableInput(false);
                return 'Here is what I found about the case';


            }

            


        }catch(err){
            console.log(err);
            return "error either your prompt is against the guidelines or something went wrong";
        }


    }


    //detects the enter after query
    const handleKeyPress = async (e)=>{
        if(e.key === 'Enter'){
            let newQuery = query;
            setQuery('');
            setDisableInput(true);
            let currentMessages = messages;
            if(currentMessages !== null){
              
                currentMessages.push({content:newQuery,sender:'human'});
                setMessages(currentMessages);
                 await  saveMessage(newQuery,'human',false);
            }else{
              
                setMessages([{content:newQuery,sender:'human'}]);
                await  saveMessage(newQuery,'human',false);
            }
            await queryAI(newQuery);
           
        }
    }



    const handleInputChange = (e)=>{
       
            let queryValue = String(e.target.value);
            setQuery(queryValue);
        
    }



    const handleButtonChange = ()=>{
        fileRef.current.click();
    }


   

    const handleFileChange = async (event) => {
            // if (!event) return;
            const file = event.target.files[0];
            

            // Check if the selected file is an image
            if (file && file.type === 'application/pdf') {
                setShowFile(true);
                setSelectedFile(file);
               
            } else {
                console.error('Please select a valid image file');
            
            }
    };


    // let speech  = ()=>{
           
    //     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
    //     if (SpeechRecognition) {


    //         // console.log('listening');
    //         let recognition = new SpeechRecognition();
    //         recognition.continuous = true; 
    //         recognition.interimResults = false; 
    //         recognition.lang = 'en-US'; 

    //         recognitionRef.current = recognition;
            
    //         recognition.onstart = () => {
    //             console.log("Voice recognition started. Try saying 'Hey Jarvis'.");
                
    //         };
            
    //         recognition.onresult = async (event) => {
               
    //             const transcript = event.results[event.results.length - 1][0].transcript.trim();
    //             setTranscript(transcript)
                

    //             let currentMessages = messages;
    //             if(messages !== null){
                    
    //                   setMessages(prev => [...prev, { content: transcript, sender: 'human' }]);
    //             }else{
    //                 setMessages([{ content: transcript, sender: 'human' }]);
    //             }
             
    //             await  saveMessage(transcript,'human',false)

    //             let askAI = await queryAI(transcript);
             
    //             console.log('asked ai',askAI);
            
               
    //             if(askAI){

    //                 recognition.stop();
                    
                    
    //                 const utterance = new SpeechSynthesisUtterance(askAI);
    //                 utterance.lang = 'en-US';
    //                 speechSynthesis.speak(utterance);
                           

            
    //             }
    
        
    //         };
        
               
                
    //         recognition.onend = () => {
            
    //             recognition.start(); // Restart recognition if it ends
    //         };
                
    //         // Start listening
    //         recognition.start();
    //         recognitionRef.current = recognition;
            
    //         return () => {
    //             recognition.stop(); // Stop recognition when the component unmounts
    //         };

    //     } else {
    //          console.warn("This browser does not support the Web Speech API.");
    //     }
    // }

    let speechRecognition = async (action)=>{


        if(action === true){
            stopListening();
            setMute(action);
    

        }else{
         
            startListening();
            setMute(action);

        }
    }


    useEffect(()=>{
        if (!transcription) return;

        const handleTranscript = async ()=>{
            let currentMessages = messages;
            if(messages !== null){
                setMessages(prev => [...prev, { content: transcription, sender: 'human' }]);
            }else{
                setMessages([{ content: transcription, sender: 'human' }]);
            }

            await  saveMessage(transcription,'human',false)

            let askAI = await queryAI(transcription);

            if(askAI){
                console.log('try to speak',askAI);
                const utterance = new SpeechSynthesisUtterance(askAI);
                utterance.lang = 'en-US';
                speechSynthesis.cancel(); // Cancel any existing speech
                speechSynthesis.speak(utterance);   
            }
        }
        handleTranscript();
    },[transcription]);

    
    
    const handleVoiceModeActivation = async ()=>{
        // setVoiceMode(!voiceMode);
      if(voiceMode === false){
       
        startListening();
        setVoiceMode(!voiceMode);

      }else{
        setVoiceMode(!voiceMode);
      }
        
    }

    const handleDraftMode = ()=>{
        setDraftScreen(!draftScreen);
        if(legalDraftMessages && legalDraftMessages.length >= 1){
            return;
        }else{
            let messageData = {
                title:'What would you like?',
                buttons:['create new draft','add new draft']
            }

            setLegalDraftMessages([messageData]);
        }
    }

    const handleAddNewDraft = async ()=>{
        let messageData = {
            title:"What's the case about?",
            textArea:['describe case'],
            buttons:['Create Draft']
        };

        setLegalDraftMessages(prev =>[...prev,messageData]);
    };



    const handleFindDraft = async (e)=>{
        // if(e.key === 'Enter'){
            const request = await fetch(`/api/pinecone/fetchdraft`,{
                method:'POST',
                headers:{
                'Content-Type':'application/JSON'
                },
                body:JSON.stringify({
                    query:searchDraft
                })
            });

            const result = await request.json();
            if(request.ok){
                let messageData = {
                    title:`Draft Generated`,
                    draft:`${result.draft.content}`
                    
                };
                setLegalDraftMessages(prev =>[...prev,messageData]);
            }
            // console.log('result',result.draft.content);
        // }
    };

    const handleDraftSearchInput = (e)=>{
        let queryValue = String(e.target.value);
        setSearchDraft(queryValue);
    }





    //custom draft adding mechanism

    
    const handleAddCustomDraft = async (name,type)=>{


        draftFileRef.current.click();

        let messageData = {
            title:"What's the title of your draft?",
            textArea:['custom draft'],
            buttons:['Upload Draft']
        };

        setLegalDraftMessages(prev =>[...prev,messageData]);






    };

    const saveCustomDraft = async ()=>{

        const { default: pdfToText } = await import('react-pdftotext');

        const text = await pdfToText(draftFile);

        const request = await fetch(`/api/pinecone/adddraft`,{
            method:'POST',
            headers:{
               'Content-Type':'application/JSON'
            },
            body:JSON.stringify({
                name:searchDraft,
                type:'custom',
                content:text
            })
        });

        if(request.ok){
            setSearchDraft('');
        }

    }

   

    const handleDraftFileChange = (event)=>{

        const file = event.target.files[0];
            

        // Check if the selected file is an image
        if (file && file.type === 'application/pdf') {
          
            setDraftFile(file);
           
        } else {
            console.error('Please select a valid image file');
        
        }

    }





    return(
        <>
            <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Istok+Web:ital,wght@0,400;0,700;1,400;1,700&family=Joan&display=swap" rel="stylesheet"></link>
            </Head>
            <div className={styles.container}>
                    {voiceMode === false && draftScreen === false &&
                        <div className={styles.leftSection}>
                            <div className={styles.leftSection_top}>
                                <h2 className={styles.leftSection_header}>Research History</h2>
                                <button onClick={()=>{router.push('/research/newchat'); setMessages(null);}}  className={styles.leftSection_newPage_button}>
                                        <img src={'/create.png'} width={28} height={28} className={styles.leftSection_button_image}/>
                                </button>
                            </div>
                        
                            <div className={styles.leftSection_history}>
                                {userData && conversations && conversations.map((i,index)=>{
                            
                                    return(
                                
                                        <Link href={`/research/${i._id}`} className={styles.leftSection_history_convo} key={index}>
                                            <p>{i.title.slice(0,25)}..</p>
                                        </Link>
                                
                                    )
                                })}
                            </div>
                                
                        </div>
                    }

                    <div className={styles.rightSection}>



                            <div className={styles.rightSection_top}>
                                    <h2 className={styles.rightSection_header}>Vakeel Ai</h2>
                                    <img className={styles.rightSection_profilePicture} src='/profilepicture.png' width={40} height={40}/>
                            </div>

                            <div className={styles.rightSection_chat}>
                                <div className={styles.rightSection_chat_content} ref={chatDivRef}>
                                        {messages && messages.length >= 1 &&  messages.map((i,index)=>{
                                            return(
                                                <>
                                                    <div className={styles.message_div} key={index}>
                                                    
                                                        {messages[index].sender === 'human' ?
                                                            <div className={styles.message_content}>
                                                                    <p>{messages[index].content}</p>
                                                            </div>
                                                            :
                                                            <div className={styles.ai_message_div}>
                                                                
                                                                <div className={styles.message_content_ai_left}>
                                                                        <img src='/shinning_black.png' width={20} height={20}/>
                                                                        <p className={styles.message_content_ai_title}>Generated</p>
                                                                </div>
                                                                <p className={styles.ai_message} dangerouslySetInnerHTML={{ __html: messages[index].content }} />
                                                                {messages[index].viewMore && <button onClick={()=>setPopUp(true)} className={styles.ai_message_more_link}>View More</button>}

                                                                {popUp ?
                                                                        <>
                                                                            <div className={styles.popUp_container}>
                                                                                    <div className={styles.popUp_div}>
                                                                                        {cases[cases.length - 1].title &&  <h2 className={styles.popUp_div_title}>{cases[cases.length - 1].title}</h2>}
                                                                                        {cases[cases.length - 1].docsource && <p className={styles.popUp_div_paragraph}>Source: {cases[cases.length -1].docsource}</p>}
                                                                                        {cases[cases.length - 1].publishdate && <p className={styles.popUp_div_paragraph}>Dated: {cases[cases.length - 1].publishdate}</p>}

                                                                                        {/* <div className={styles.popUpdiv_bottom}> */}
                                                                                            <div className={styles.popUp_div_document}>
                                                                                                {cases[cases.length - 1].doc && <p dangerouslySetInnerHTML={{ __html: cases[cases.length -1].doc }}/>}
                                                                                            </div>
                                                                                            <button className={styles.popUp_div_button} onClick={()=>setPopUp(false)}>
                                                                                                Cancel
                                                                                            </button>
                                                                                        {/* </div> */}
                                                                                        


                                                                                    </div>

                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <>


                                                                        </>

                                                                }
                                                
                                                            </div>
                                                            
                                                        }


                                                    </div>

                                                    
                                                
                                                </>
                                            )
                                        })}
                                </div>

                                
                            </div>

                            <div className={styles.rightSection_bottom}>
                                    <div className={styles.rightSection_inputDiv} >
                                        {selectedFile !== null && showFile && 
                                            <div className={styles.rightSection_inputDiv_fileSection}>
                                                <div className={styles.rightSection_inputDiv_fileDiv}>
                                                    
                                                        <img src={'/file.png'} width={25} height={25}/>
                                                        <p className={styles.document_name}>{selectedFile.name.slice(0,12)}..</p>
                                                    
                                                </div>
                                            </div>
                                        }
                                        <textarea className={styles.rightSection_input} onChange={handleInputChange} placeholder='Research' onKeyPress={handleKeyPress} value={query} disabled={disableInput}/>
                                        
                                        <div className={styles.rightSection_inputDiv_tools}>

                                            <div className={styles.rightSection_inputDiv_tools_left}>

                                                    <input type='file' className={styles.rightSection_inputDiv_file} ref={fileRef} onChange={(e)=>handleFileChange(e)}/>
                                                    <button className={styles.rightSection_inputDiv_button} onClick={()=>handleButtonChange()}>
                                                        <img src={'/plus.png'} width={35} height={35}/>
                                                    </button>

                                                    <button className={styles.rightSection_inputDiv_draftButton} onClick={()=>handleDraftMode()}>
                                                            <img src={'/legal_work.png'} className={styles.draftButton_image} width={20} height={20}/>
                                                            <p className={styles.draftButton_text}>legal draft</p>
                                                    </button>

                                            </div>

                                            <div className={styles.rightSection_inputDiv_tools_right}>

                                                
                                                <button className={styles.rightSection_inputDiv_voiceButton} onClick={()=>handleVoiceModeActivation()}>
                                                    <img src={'/sound-recognition.png'} width={30} height={30}/>
                                                </button>

                                            </div>
                                            
                                        </div>
                                            
                                                    
                                                
                                            
                                        
                                    </div>
                            </div>


                            
                            
                            
                    </div>

                    {voiceMode && 

                        <div className={styles.voiceSection}>
                                    <div className={styles.voiceSection_top}>    
                                            <h2 className={styles.voiceSection_header}>Voice Mode</h2>
                                    </div>

                                    <div className={styles.voiceSection_bottom}>

                                            <button className={styles.voiceSection_voiceButton} >

                                            </button>

                                            <p className={styles.voiceSection_voiceTranscript}>{transcription.slice(0,35)}</p>

                                    </div>
                                    <div className={styles.voiceSection_controls}>
                                            <button className={styles.voiceSection_micButton} onClick={()=>speechRecognition(!mute)}>
                                                <img src={mute ? '/mute.png' :'/unmute.png'} width={35} height={35}/>
                                            </button>

                                            <button className={styles.voiceSection_closeButton} onClick={()=>setVoiceMode(false)}>
                                                <img src={'/close.png'} width={35} height={35}/>
                                            </button>

                                    </div>    
                        </div>
                    }

                    {draftScreen && 
                            
                            <div className={styles.draftSection}>
                                

                                <div className={styles.draftSection_top}>
                                    <p className={styles.draftSection_top_header}>Draft Mode</p>
                                </div>

                                <div className={styles.draftSection_body}>
                                  
                                    {legalDraftMessages.length >=1 && legalDraftMessages.map((value,index)=>{
                                       
                                        return(

                                            <motion.div   initial={{ opacity: 0, scale: 0.8, y: 50 }} // Start slightly smaller and lower
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }} // Pop up to normal size
                                            transition={{ duration: 0.6, ease: "easeOut" }} className={styles.draftSection_body_message} key={index}>

                                                <div className={styles.draftSection_body_message_top}>
                                                    <div className={styles.draftSection_body_message_logo}>
                                                        <img src={'/bot.png'} width={30} height={30}/>
                                                    </div>
                                                    <p className={styles.draftSection_body_message_top_header}>{legalDraftMessages[index].title}</p>
                                                </div>

                                                {legalDraftMessages[index].draft &&
                                                    <div className={styles.draftSection_body_message_draft}>
                                                            <p>{legalDraftMessages[index].draft}</p>
                                                    </div>
                                                }

                                                {legalDraftMessages[index].buttons &&  legalDraftMessages[index].buttons.length === 2 && 
                                                    <div className={styles.draftSection_body_message_content}>
                                                        
                                                    


                                                        <button className={styles.draftSection_body_message_button} onClick={()=>handleAddNewDraft()}>
                                                                <p>Create new draft</p>
                                                        </button>   

                                                        <input type='file' className={styles.rightSection_inputDiv_file} ref={draftFileRef} onChange={(e)=>handleDraftFileChange(e)}/>
                                                        <button className={styles.draftSection_body_message_button} onClick={()=>handleAddCustomDraft('bail in criminal case','custom')}>
                                                                <p>Add custom draft</p>
                                                        </button>   
                                                    

                                                    </div>
                                                }

                                                {legalDraftMessages[index].textArea && legalDraftMessages[index].textArea.length >=1 &&
                                                   <textarea placeholder={legalDraftMessages[index].textArea[0]} className={styles.draftSection_body_textArea}   onChange={handleDraftSearchInput}/>

                                                }

                                                {
                                                    legalDraftMessages[index].buttons && legalDraftMessages[index].buttons.length === 1 && legalDraftMessages[index].buttons[0] === 'Upload Draft' &&
                                                    <div className={styles.draftSection_body_message_content}>
                                                         <button className={styles.draftSection_body_message_button} onClick={()=>saveCustomDraft()}>
                                                                <p>Upload Draft</p>
                                                        </button>   
                                                    </div>
                                                }

                                                {
                                                    legalDraftMessages[index].buttons && legalDraftMessages[index].buttons.length === 1 && legalDraftMessages[index].buttons[0] === 'Create Draft' &&
                                                    <div className={styles.draftSection_body_message_content}>
                                                            <button className={styles.draftSection_body_message_button} onClick={()=>handleFindDraft()}>
                                                                <p>Create Draft</p>
                                                        </button>   
                                                    </div>
                                                }

                                                
                                            </motion.div>


                                        )
                                    })}
                                        
                                </div> 

                            </div>
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                    }
            </div>
        </>
    )
}