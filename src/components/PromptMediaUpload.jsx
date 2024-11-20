import { useState, useRef, useEffect } from 'react';import { Upload, Mic, Square, Send, RefreshCw } from 'lucide-react';
import MarkdownPreview from '@uiw/react-markdown-preview';

// eslint-disable-next-line react/prop-types
export const PromptMediaUpload = ({ onFileSelect }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState('');
  const fileInputRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);

  // Timer logic for recording
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          // Stop recording after 1 minute (60 seconds)
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

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
      setRecordingDuration(0);

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
      clearInterval(timerRef.current);
    }
  };

  const handleSubmitRecording = () => {
    if (audioBlob) {
      const audioFile = new File([audioBlob], 'recording.wav', {
        type: 'audio/wav'
      });
      onFileSelect(audioFile);
      setAudioBlob(null);
      setRecordingDuration(0);
    }
  };

  const requestTopic = async () => {
    setTopicsLoading(true);
    try {
      const response = await fetch(
        'https://youtube-whisperer.onrender.com/api/get-topics'
      );
      const data = await response.json();
      setSuggestedTopics(data.topics);
    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setTopicsLoading(false);
    }
  };

  return (
    <div className='p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg space-y-4'>
      {/* Topic Suggestion Section */}
      {suggestedTopics.length > 1 && (
        <div className='text-center bg-green-100 dark:bg-green-900 p-4 rounded-lg'>
          <h3 className='text-lg font-bold text-green-800 dark:text-green-200 mb-2'>
            Your Topics
          </h3>
          <div className='prose dark:prose-invert '>
            <MarkdownPreview source={suggestedTopics} style={{ padding: 16 }} />
          </div>
        </div>
      )}
      <button
        onClick={requestTopic}
        className='w-full md:w-[30%] mx-auto flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition'
      >
        <RefreshCw
          className={`${topicsLoading && 'animate-spin'} w-4 h-4 mr-2`}
        />
        Generate Topics
      </button>

      {/* Recording Duration Display */}
      {recording && (
        <div className='text-center text-red-600 dark:text-red-400'>
          Recording:{' '}
          {`${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60)
            .toString()
            .padStart(2, '0')}`}
        </div>
      )}

      {/* File Upload Section */}
      <div className='flex flex-col items-center justify-center border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-6 hover:border-green-400 dark:hover:border-green-600 transition-colors'>
        <input
          type='file'
          accept='audio/*,video/*'
          onChange={handleFileUpload}
          className='hidden'
          id='file-upload'
          ref={fileInputRef}
        />
        <label
          htmlFor='file-upload'
          className='flex flex-col items-center cursor-pointer'
        >
          <Upload className='w-8 h-8 text-green-600 dark:text-green-400 mb-2' />
          <span className='text-sm text-green-700 dark:text-green-300'>
            Upload media file
          </span>
        </label>
      </div>

      {/* Recording Controls */}
      <div className='flex justify-center space-x-4'>
        {/* Start Recording Button */}
        {!recording && !audioBlob && (
          <button
            onClick={startRecording}
            className='flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition'
          >
            <Mic className='w-4 h-4 mr-2' />
            Start Recording
          </button>
        )}

        {/* Stop Recording Button */}
        {recording && (
          <button
            onClick={stopRecording}
            className='flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition'
          >
            <Square className='w-4 h-4 mr-2' />
            Stop Recording
          </button>
        )}

        {/* Submit Recording Button */}
        {audioBlob && (
          <button
            onClick={handleSubmitRecording}
            className='flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition'
          >
            <Send className='w-4 h-4 mr-2' />
            Use Recording
          </button>
        )}
      </div>
    </div>
  );
};
