# Real-Time Audio Transcription with Flask, SocketIO, and Deepgram

This project implements a real-time audio transcription service using Flask, Socket.IO, and Deepgram's API. The frontend (built with React) streams audio data to the backend Flask server, which then uses Deepgram's WebSocket API for live transcription. The transcriptions are displayed on the frontend interface in real-time.

## Features
- Real-time streaming of audio data from client to server
- Live transcription of audio using Deepgram's WebSocket API
- Real-time display of transcriptions in the client interface

## Requirements
- Python 3.7+
- Node.js (for running the frontend)
- Deepgram API key with streaming transcription permissions

## Project Structure

project-root/
├── .env                      # Environment file for API keys
├── backend/                  # Backend folder
│   ├── app.py               # Flask application with Socket.IO and Deepgram integration
│   └── requirements.txt     # Python dependencies for the backend
└── frontend/                # Frontend folder
    ├── src/                 # Source files for React app
    │   └── App.js          # Main component for audio recording and transcription
    ├── package.json        # Node.js dependencies
    └── public/             # Public assets


## Installation

### 1. Clone the Repository

git clone <repository_url>
cd <repository_folder>


### 2. Backend Setup

#### Create a Virtual Environment and Install Dependencies

cd backend
python -m venv venv
# On Unix/macOS
source venv/bin/activate
# On Windows
# venv\Scripts\activate
pip install -r requirements.txt


#### Configure Environment Variables
Create a `.env` file in the backend directory:

DEEPGRAM_API_KEY=your_deepgram_api_key


### 3. Frontend Setup

cd ../frontend
npm install


## Running the Application

### Start the Backend Server

cd backend
python app.py

The Flask server will start on `http://127.0.0.1:5000`

### Start the Frontend Development Server

cd frontend
npm start

The React app will start on `http://localhost:3000`

## Usage
1. Navigate to `http://localhost:3000` in your browser
2. Click "Start Recording" to begin live transcription
3. Speak into your microphone
4. View real-time transcriptions as they appear

## Troubleshooting

### WebSocket Connection Issues
If you encounter WebSocket-related errors:
- Verify your Deepgram API key is valid and has streaming permissions
- Ensure the audio format matches the expected encoding (Opus)
- Check your internet connection

### CORS Issues
If you experience CORS-related problems:
- Verify that `cors_allowed_origins="*"` is set in the SocketIO initialization in `app.py`
- Check browser console for specific CORS error messages

## Dependencies
Backend dependencies (requirements.txt):

Flask==2.1.2
flask-socketio==5.2.0
python-dotenv==0.20.0
eventlet==0.33.0
deepgram-sdk==2.12.0


## Documentation References
- [Deepgram API Documentation](https://developers.deepgram.com/docs)
- [Flask-SocketIO Documentation](https://flask-socketio.readthedocs.io)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
