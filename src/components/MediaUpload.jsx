import  { useState, useRef } from 'react';
import { Upload, Mic, Square, Send } from 'lucide-react';

// eslint-disable-next-line react/prop-types
export const MediaUpload = ({ onFileSelect }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const fileInputRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
      fileInputRef.current.value = null;
    }

  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const handleSubmitRecording = () => {
    if (audioBlob) {
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      onFileSelect(audioFile);
      setAudioBlob(null);
    }
  };

  return (
    <div className="p-6 bg-white/50 dark:bg-gray-800/50  rounded-lg shadow-lg">
      <div className="space-y-4">
        {/* File Upload Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-6 hover:border-green-400 dark:hover:border-green-600 transition-colors">
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Upload media file
            </span>
          </label>
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center space-x-4">
          {/* Start Recording Button */}
          {!recording && !audioBlob && (
            <button
              onClick={startRecording}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </button>
          )}

          {/* Stop Recording Button */}
          {recording && (
            <button
              onClick={stopRecording}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </button>
          )}

          {/* Submit Recording Button */}
          {audioBlob && (
            <button
              onClick={handleSubmitRecording}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              <Send className="w-4 h-4 mr-2" />
              Use Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
