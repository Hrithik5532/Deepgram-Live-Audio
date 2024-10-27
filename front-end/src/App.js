import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

export default function App() {
    const [transcription, setTranscription] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [debugLog, setDebugLog] = useState([]); // Add debug log state

    // Helper function to add debug messages
    const addDebugLog = (message) => {
        setDebugLog(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    };

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            transports: ['websocket'],
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });

        newSocket.on('connect', () => {
            addDebugLog("Socket.IO Connected");
            setConnectionStatus("Connected");
            setError(null);
        });

        newSocket.on('connection_established', (data) => {
            addDebugLog(`Connection established: ${data.message}`);
        });

        newSocket.on('transcription', (data) => {
            addDebugLog(`Received transcription: ${JSON.stringify(data)}`);
            if (data.transcript) {
                setTranscription(prev => prev + " " + data.transcript);
            }
        });

        newSocket.on('connect_error', (error) => {
            addDebugLog(`Socket connection error: ${error.message}`);
            setError("Socket connection error");
            setConnectionStatus("Error");
        });

        newSocket.on('disconnect', () => {
            addDebugLog("Socket.IO disconnected");
            setConnectionStatus("Disconnected");
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    const startRecording = useCallback(async() => {
        try {
            if (connectionStatus !== "Connected") {
                setError("Socket not connected. Please wait or refresh the page.");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                }
            });

            addDebugLog("Microphone access granted");

            const recorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
                audioBitsPerSecond: 16000
            });

            recorder.ondataavailable = async(event) => {
                if (event.data.size > 0 && socket && socket.connected) {
                    try {
                        const arrayBuffer = await event.data.arrayBuffer();
                        const base64Audio = btoa(
                            new Uint8Array(arrayBuffer)
                            .reduce((data, byte) => data + String.fromCharCode(byte), '')
                        );

                        addDebugLog(`Sending audio chunk: ${event.data.size} bytes`);
                        socket.emit('audio_stream', {
                            audio: base64Audio,
                            type: 'audio/webm'
                        });
                    } catch (err) {
                        addDebugLog(`Error processing audio data: ${err.message}`);
                    }
                }
            };

            recorder.start(250);
            setMediaRecorder(recorder);
            setIsRecording(true);
            setError(null);
            addDebugLog("Recording started");
        } catch (err) {
            addDebugLog(`Microphone error: ${err.message}`);
            setError("Error accessing microphone: " + err.message);
        }
    }, [socket, connectionStatus]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setMediaRecorder(null);
            addDebugLog("Recording stopped");
        }
        setIsRecording(false);
    }, [mediaRecorder]);

    const clearTranscription = () => {
        setTranscription("");
        setDebugLog([]);
        addDebugLog("Transcription and logs cleared");
    };

    return ( <
        div className = "min-h-screen bg-gray-100 p-8" >
        <
        div className = "max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6" >
        <
        h1 className = "text-3xl font-bold text-center mb-8" >
        Live Audio Transcription <
        /h1>

        <
        div className = "text-center mb-4" >
        <
        span className = { `inline-block px-3 py-1 rounded-full text-sm ${
                        connectionStatus === "Connected" ? "bg-green-100 text-green-800" :
                        connectionStatus === "Error" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                    }` } > { connectionStatus } <
        /span> < /
        div >

        <
        div className = "flex justify-center gap-4 mb-6" >
        <
        button onClick = { isRecording ? stopRecording : startRecording }
        disabled = { connectionStatus !== "Connected" }
        className = { `px-6 py-3 rounded-lg font-semibold ${
                            isRecording 
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : connectionStatus === "Connected"
                                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                                    : "bg-gray-400 text-white cursor-not-allowed"
                        }` } > { isRecording ? "Stop Recording" : "Start Recording" } <
        /button>

        <
        button onClick = { clearTranscription }
        className = "px-6 py-3 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300" >
        Clear <
        /button> < /
        div >

        {
            error && ( <
                div className = "mb-4 p-4 bg-red-100 text-red-700 rounded-lg" > { error } <
                /div>
            )
        }

        <
        div className = "bg-gray-50 p-6 rounded-lg" >
        <
        h2 className = "text-xl font-semibold mb-4" > Transcription: < /h2> <
        p className = "whitespace-pre-wrap" > { transcription || "No transcription yet..." } <
        /p> < /
        div >

        { /* Debug Log Section */ } <
        div className = "mt-6 bg-gray-50 p-6 rounded-lg" >
        <
        h2 className = "text-xl font-semibold mb-4" > Debug Log: < /h2> <
        div className = "max-h-60 overflow-y-auto" > {
            debugLog.map((log, index) => ( <
                div key = { index }
                className = "text-sm font-mono mb-1" > { log } <
                /div>
            ))
        } <
        /div> < /
        div > <
        /div> < /
        div >
    );
}