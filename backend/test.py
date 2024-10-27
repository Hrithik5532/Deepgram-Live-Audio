import os
from deepgram import Deepgram
from dotenv import load_dotenv
import asyncio

# Load the Deepgram API key from .env file
load_dotenv()
dg_client = Deepgram(os.getenv('DEEPGRAM_API_KEY'))

async def test_deepgram_connection():
    try:
        # Attempt to initialize the Deepgram WebSocket
        deepgram_socket = await dg_client.transcription.live(
            {'punctuate': True}, 
            stream=True
        )
        if deepgram_socket is None:
            print("Failed to initialize Deepgram WebSocket.")
        else:
            print("Deepgram WebSocket initialized successfully.")
            # Removed close method as it's not supported
    except Exception as e:
        print(f"Error initializing Deepgram WebSocket: {e}")

# Run the test
asyncio.run(test_deepgram_connection())
