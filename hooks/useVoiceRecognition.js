import { useRef,useState, useEffect } from "react";
const useVoiceRecognition = ()=>{

    const recognitionRef = useRef(null);
    const [listening,setListening] = useState(false);
    const [transcription,setTranscription] = useState('');

    useEffect(()=>{

        const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if(!speechRecognition){
            console.warn("Web Speech Api not available here");
            return;
        }

        const recognition = new speechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = ()=>{
            console.log('Voice recognition started.');
            setListening(true);
        };

        recognition.onend = ()=>{
            console.log('Recognition ended.');
            setListening(false);
        };

        recognition.onresult = (event)=>{
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            console.log('Transcript',transcript);

            setTranscription(transcript);
        }

        recognitionRef.current = recognition;



    },[]);


    const startListening = () => {
        if (recognitionRef.current && !listening) {
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && listening) {
            recognitionRef.current.stop();
        }
    };

    return { startListening, stopListening, listening, transcription };


    
}

export default useVoiceRecognition;