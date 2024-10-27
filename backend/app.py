# First, import and initialize eventlet before any other imports
import eventlet
eventlet.monkey_patch()

# Now import other dependencies
from flask import Flask, request
from flask_socketio import SocketIO, emit
from deepgram import Deepgram
from dotenv import load_dotenv
import os
import asyncio
import base64
from engineio.async_drivers import eventlet

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Create application context
app.app_context().push()

# Initialize SocketIO after Flask app
socketio = SocketIO(app, 
                   cors_allowed_origins="*",
                   async_mode='eventlet',
                   logger=True,
                   engineio_logger=True)

# Initialize Deepgram client
dg_client = Deepgram(os.getenv('DEEPGRAM_API_KEY'))

# Store active WebSocket connections
active_connections = {}

async def process_audio(connection_id, audio_data):
    try:
        if connection_id not in active_connections:
            print(f"Creating new Deepgram connection for {connection_id}")
            socket = await dg_client.transcription.live({
                'punctuate': True,
                'encoding': 'webm',
                'sample_rate': 16000,
                'channels': 1,
                'model': 'general',
                'language': 'en'
            })
            
            async def process_transcript(response):
                if response and response.get('channel'):
                    transcript = response['channel']['alternatives'][0].get('transcript', '')
                    if transcript:
                        print(f"Emitting transcript: {transcript}")
                        socketio.emit('transcription', {'transcript': transcript}, room=connection_id)
            
            socket.registerHandler(socket.event.TRANSCRIPT_RECEIVED, process_transcript)
            active_connections[connection_id] = socket
            print(f"Created new Deepgram WebSocket for connection {connection_id}")
        
        await active_connections[connection_id].send(audio_data)
        
    except Exception as e:
        print(f"Error processing audio: {e}")
        if connection_id in active_connections:
            await active_connections[connection_id].finish()
            del active_connections[connection_id]

@socketio.on('connect')
def handle_connect():
    sid = request.sid
    print(f"Client connected: {sid}")
    emit('connection_established', {'message': 'Connected successfully'})

@socketio.on('disconnect')
def handle_disconnect():
    connection_id = request.sid
    if connection_id in active_connections:
        try:
            active_connections[connection_id].finish()
            del active_connections[connection_id]
            print(f"Cleaned up connection {connection_id}")
        except Exception as e:
            print(f"Error cleaning up connection: {e}")

@socketio.on('audio_stream')
def handle_audio_stream(data):
    try:
        connection_id = request.sid
        print(f"Received audio data from {connection_id}")
        eventlet.spawn(process_audio, connection_id, data)
    except Exception as e:
        print(f"Error handling audio stream: {e}")

if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)