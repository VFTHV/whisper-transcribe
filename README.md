# 🎤 Whisper Transcribe

A beautiful voice-to-text transcription application built with React, Express, and OpenAI's Whisper API. Record your voice and get instant transcription, just like ChatGPT's voice input feature.

## ✨ Features

- 🎙️ **Voice Recording**: Click to start/stop recording with visual feedback
- 🔄 **Real-time Processing**: See processing status with animated spinner
- 📝 **Instant Transcription**: Get your speech converted to text using OpenAI Whisper
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile Friendly**: Works perfectly on desktop and mobile devices
- 🧹 **Easy Management**: Clear transcriptions with one click

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- OpenAI API key

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd whisper-transcribe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

4. **Start the development servers**

   ```bash
   npm run dev:all
   ```

   This will start both:

   - Frontend (React) on `http://localhost:5173`
   - Backend (Express) on `http://localhost:3001`

### Alternative Commands

- **Frontend only**: `npm run dev`
- **Backend only**: `npm run dev:server`
- **Build for production**: `npm run build`

## 🎯 How to Use

1. **Open the application** in your browser at `http://localhost:5173`
2. **Click "Start Recording"** to begin recording your voice
3. **Speak clearly** into your microphone
4. **Click "Stop Recording"** when you're done speaking
5. **Wait for processing** - you'll see a spinner while the audio is being transcribed
6. **View your transcription** - the text will appear below the recording button
7. **Clear the transcription** if you want to start fresh

## 🛠️ Technical Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Modern CSS** with animations and responsive design
- **MediaRecorder API** for browser-based audio recording

### Backend

- **Express.js** with TypeScript
- **OpenAI Whisper API** for speech-to-text transcription
- **Multer** for file upload handling
- **CORS** enabled for cross-origin requests

### Key Features

- **Audio Format**: Records in WebM format for optimal quality
- **Error Handling**: Comprehensive error handling and user feedback
- **File Management**: Automatic cleanup of uploaded audio files
- **Security**: Proper file type validation and API key management

## 🔧 Configuration

### Environment Variables

| Variable         | Description                         | Required |
| ---------------- | ----------------------------------- | -------- |
| `OPENAI_API_KEY` | Your OpenAI API key                 | Yes      |
| `PORT`           | Backend server port (default: 3001) | No       |

### API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/transcribe` - Audio transcription endpoint

## 🎨 Customization

The application uses a modern gradient design that can be easily customized:

- **Colors**: Edit the CSS variables in `src/App.css`
- **Animations**: Modify the keyframe animations for different effects
- **Layout**: Adjust the container and component styles

## 🐛 Troubleshooting

### Common Issues

1. **Microphone not working**

   - Ensure your browser has permission to access the microphone
   - Check if another application is using the microphone

2. **Transcription fails**

   - Verify your OpenAI API key is correct
   - Check the browser console for error messages
   - Ensure the backend server is running

3. **CORS errors**
   - Make sure the backend is running on the correct port
   - Check that the frontend is making requests to the correct URL

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile browsers**: Full support

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.
