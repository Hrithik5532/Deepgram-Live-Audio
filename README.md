Real-Time Audio Transcription with Flask, SocketIO, and Deepgram
This project is a real-time audio transcription service using Flask, Socket.IO, and Deepgram's API. The frontend (built with React) streams audio data to the backend Flask server, which then uses Deepgram's WebSocket API for live transcription. The transcriptions are displayed on the frontend interface as they are generated.

Features
Real-time streaming of audio data from client to server.
Transcription of audio in real time using Deepgram’s WebSocket API.
Display of transcriptions in the client interface.
Requirements
Python 3.7+
Node.js (for running the frontend)
Deepgram API key with streaming transcription permissions
Project Structure
plaintext
Copy code
project-root
│
├── .env                  # Environment file for API keys
├── backend                   # Backend folder
│   ├── app.py                # Flask application with Socket.IO and Deepgram integration
│   ├── requirements.txt      # Python dependencies for the backend
│
└── frontend                  # Frontend folder
    ├── src                   # Source files for React app
    │   └── App.js            # Main component for audio recording and transcription
    ├── package.json          # Node.js dependencies
    └── public                # Public assets
Installation
1. Clone the Repository
bash
Copy code
git clone <repository_url>
cd <repository_folder>
2. Backend Setup
Create a Virtual Environment and Install Dependencies
In the backend folder, create and activate a virtual environment, then install the required dependencies.

bash
Copy code
cd backend
python -m venv venv
source venv/bin/activate    # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
Create a .env File
In the backend folder, create a .env file to store your Deepgram API key:

plaintext
Copy code
DEEPGRAM_API_KEY=your_deepgram_api_key
3. Frontend Setup
Navigate to the frontend folder and install the dependencies.

bash
Copy code
cd ../frontend
npm install
4. Run the Project
Start the Backend Server
bash
Copy code
cd backend
python app.py
The Flask server will start on http://127.0.0.1:5000.

Start the Frontend Development Server
In a new terminal, start the frontend:

bash
Copy code
cd frontend
npm start
The frontend React app will start on http://localhost:3000.

Usage
Open the frontend React app in your browser at http://localhost:3000.
Click on "Start Recording" to begin live transcription.
The audio data will be streamed to the Flask server, then sent to Deepgram for transcription.
Transcriptions will appear in real-time in the app.
Troubleshooting
WebSocket NoneType Errors: If you encounter errors related to NoneType on the WebSocket connection, verify:

Your Deepgram API key is correctly configured and has streaming transcription permissions.
The audio format matches the expected encoding (e.g., Opus).
CORS Issues: If you face CORS-related issues, confirm that cors_allowed_origins="*" is set in the SocketIO initialization in app.py.

Dependencies
Listed in requirements.txt:

plaintext
Copy code
Flask==2.1.2
flask-socketio==5.2.0
python-dotenv==0.20.0
eventlet==0.33.0
deepgram-sdk==2.12.0
Acknowledgments
Deepgram API Documentation
Flask-SocketIO Documentation
License
This project is licensed under the MIT License.

