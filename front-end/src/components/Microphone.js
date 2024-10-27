import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

const Microphone = ({ onStop }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);

    const startRecording = async() => {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        mediaRecorderRef.current.start();
    };

    const stopRecording = () => {
        setIsRecording(false);
        mediaRecorderRef.current.stop();
    };

    const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
            onStop(event.data);
        }
    };

    return ( <
            div className = "flex flex-col justify-center items-center mb-6" >
            <
            button className = { `${
          isRecording ? 'bg-red-500' : 'bg-green-500'
        } text-white px-6 py-4 rounded-full flex items-center transition-transform transform hover:scale-105` }
            onClick = { isRecording ? stopRecording : startRecording } >
            <
            FontAwesomeIcon icon = { isRecording ? faStop : faMicrophone }
            className = "mr-2" / > { isRecording ? 'Stop Recording' : 'Start Recording' } <
            /button> {
            isRecording && ( <
                div className = "mt-4 w-[50%] h-1 bg-gradient-to-r from-blue-500 to-green-500 animate-pulse rounded-full" > < /div>
            )
        } <
        /div>
);
};

export default Microphone;