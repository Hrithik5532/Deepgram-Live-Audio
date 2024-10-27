import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000"); // Connect to Flask backend

const AudioTranscription = () => {
    const [transcription, setTranscription] = useState(""); // Live transcription
    const [isRecording, setIsRecording] = useState(false); // Recording state
    let mediaRecorder = null; // To hold the media recorder instance

    useEffect(() => {
        // Receive transcription updates from Flask via SocketIO
        socket.on("transcription_update", (data) => {
            setTranscription((prev) => prev + data.transcription + " ");
        });

        return () => {
            socket.off("transcription_update");
        };
    }, []);

    // Start recording function
    const startRecording = async() => {
        setIsRecording(true);

        // Get audio stream from the user's microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        // Send audio data to backend in chunks
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && isRecording) {
                socket.emit("audio_stream", event.data); // Emit audio data to Flask
            }
        };

        mediaRecorder.start(250); // Send data every 250ms
    };

    // Stop recording function
    const stopRecording = () => {
        setIsRecording(false);
        if (mediaRecorder) {
            mediaRecorder.stop(); // Stop recording
        }
    };

    return ( <
        div className = "min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4" >
        <
        div className = "w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg" >
        <
        h1 className = "text-3xl font-bold text-center mb-8" > Live Audio Transcription < /h1>

        <
        div className = "flex justify-center mb-6" > {!isRecording ? ( <
                button onClick = { startRecording }
                className = "bg-green-500 px-4 py-2 rounded-lg" >
                Start Recording <
                /button>
            ) : ( <
                button onClick = { stopRecording }
                className = "bg-red-500 px-4 py-2 rounded-lg" >
                Stop Recording <
                /button>
            )
        } <
        /div>

        <
        div className = "bg-gray-700 p-4 rounded-lg mb-4" >
        <
        h2 className = "text-xl font-bold mb-2" > Live Transcription: < /h2> <
        p > { transcription || "No transcription yet..." } < /p> <
        /div> <
        /div> <
        /div>
    );
};

export default AudioTranscription;