import styles from '@/styles/ChatRoom.module.css';
import { useState } from 'react';
import Head from 'next/head';
import { GoogleGenAI, GoogleGenerativeAI } from "@google/genai";
const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API });
import Markdown from 'react-markdown';
export default function Chat(){

    const [query,setQuery] = useState('');
    const [messages,setMessages] = useState(null);
    const [cases,setCases] = useState(null);
    const [popUp,setPopUp] = useState(false);


    const queryAI = async (prompt)=> {
        
        try{
                    //this code is responsible
                            const response2 = await fetch(`/api/fetchCases?query=${prompt}`);
                            const data = await response2.json();
                            // console.log(data);

                        


                            // console.log("trying to run the model");
                            const response = await genAI.models.generateContent({
                                model: "gemini-2.0-flash",
                                contents: `summarise this in very short paragraphs (no markdown & no bold text) - ${data.doc}`,
                            });
                            
                        
                            const result = await response.text;

                            let newResult = 
                            `
                                From: <Strong>${data.docsource}</Strong> <br/>
                                Title: <Strong>${data.title}</Strong> <br/>
                                Summary: <br/>
                                ${result}
                            `;

                            let newCases = cases;
                            if(cases !== null&&Array.isArray(cases)){
                                // console.log('happened')
                                console.log(data);
                                newCases = [...cases,data];
                            }else{
                                // console.log('happened 2')
                                console.log(data);
                                newCases = [data];
                            }
                            setCases(newCases);
                            
                    //

            // let newResult = 
            // `
            //     From: <Strong>Supreme Court Of India</Strong> <br/>
            //     Title: <Strong>Sri Jayendra Saraswathy ... vs State Of Tamil Nadu And Others on 26 October, 2005</Strong> <br/>
            //     Summary: <br/>
            //     The Supreme Court heard a petition from Sri Jayendra Saraswathy Swamigal seeking transfer of his criminal case from Tamil Nadu, citing concerns of unfair trial due to state machinery bias. The petitioner alleged state actions like statements by the Chief Minister, solatium payment to the victim's widow, false cases against co-accused and lawyers, and freezing of Mutt accounts created an atmosphere of bias. The Court found merit in the petitioner's concerns, highlighting the state's actions against lawyers, freezing of Mutt accounts and detention of co-accused. The Court acknowledged a reasonable apprehension of unfair trial in Tamil Nadu. The Court allowed the transfer petition, moving the case to the Principal District and Sessions Judge, Pondicherry, citing language familiarity and proximity to the original location as factors.
            // `

            let newMessages;
            if(messages !== null){
                // console.log('not null 2');
                newMessages  = [...messages,{content:newResult,sender:'ai'}];
            }else{
                // console.log('null 2');
                newMessages = [{content:prompt,sender:'human'},{content:newResult,sender:'ai'}];
            }
            // console.log("newCases that was set:", newCases); 
            return setMessages(newMessages);



            


        }catch(err){
            console.log(err);
            return "error either your prompt is against the guidelines or something went wrong";
        }
    }

    const handleKeyPress = async (e)=>{
        if(e.key === 'Enter'){
            let newQuery = query;
            setQuery('');
            let currentMessages = messages;
            if(currentMessages !== null){
                // console.log("not null")
                currentMessages.push({content:newQuery,sender:'human'});
                setMessages(currentMessages);
            }else{
                // console.log("null")
                setMessages([{content:newQuery,sender:'human'}]);
            }
            await queryAI(newQuery);
           
        }
    }

    const handleInputChange = (e)=>{
       
            let queryValue = String(e.target.value);
            setQuery(queryValue);
        
    }
    return(
        <>
            <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Istok+Web:ital,wght@0,400;0,700;1,400;1,700&family=Joan&display=swap" rel="stylesheet"></link>
            </Head>
            <div className={styles.container}>
                <div className={styles.leftSection}>

                </div>
                <div className={styles.rightSection}>

                        <div className={styles.rightSection_top}>
                                <h2 className={styles.rightSection_header}>Vakeel Ai</h2>
                                <img className={styles.rightSection_profilePicture} src='/profilepicture.png' width={40} height={40}/>
                        </div>

                        <div className={styles.rightSection_chat}>
                            <div className={styles.rightSection_chat_content}>
                                    {messages && messages.length >= 1 &&  messages.map((i,index)=>{
                                        return(
                                            <>
                                                <div className={styles.message_div}>
                                                
                                                    {messages[index].sender === 'human' ?
                                                        <div className={styles.message_content}>
                                                             <p>{messages[index].content}</p>
                                                        </div>
                                                        :
                                                        <div className={styles.ai_message_div}>
                                                          
                                                            <div className={styles.message_content_ai_left}>
                                                                   <img src='/shining.png' width={20} height={20}/>
                                                                   <p className={styles.message_content_ai_title}>Generated</p>
                                                           </div>
                                                            <p className={styles.ai_message} dangerouslySetInnerHTML={{ __html: messages[index].content }} />
                                                            <button onClick={()=>setPopUp(true)} className={styles.ai_message_more_link}>View More</button>

                                                            {popUp ?
                                                                    <>
                                                                        <div className={styles.popUp_container}>
                                                                                <div className={styles.popUp_div}>
                                                                                    <h2 className={styles.popUp_div_title}>{cases[cases.length - 1].title}</h2>
                                                                                    <p className={styles.popUp_div_paragraph}>Source: {cases[cases.length -1].docsource}</p>
                                                                                    <p className={styles.popUp_div_paragraph}>Dated: {cases[cases.length - 1].publishdate}</p>

                                                                                    {/* <div className={styles.popUpdiv_bottom}> */}
                                                                                        <div className={styles.popUp_div_document}>
                                                                                            <p dangerouslySetInnerHTML={{ __html: cases[cases.length -1].doc }}/>
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

                                    <textarea className={styles.rightSection_input} onChange={handleInputChange} placeholder='Research' onKeyPress={handleKeyPress} value={query}/>
                                </div>
                        </div>
                </div>
            </div>
        </>
    )
}