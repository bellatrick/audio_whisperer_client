import { useState } from 'react';import MarkdownPreview from '@uiw/react-markdown-preview';
import { PromptMediaUpload } from '../src/components/PromptMediaUpload';

export const FluencyAnalyzer = () => {
  const [loading, setLoading] = useState(false);

  const [fileName, setFileName] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileSelect = async (file) => {
    setFileName(file.name);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Audio analysis API
      const analysisResponse = await fetch(
        'https://youtube-whisperer.onrender.com/api/fluency-analyzer',
        {
          method: 'POST',
          body: formData
        }
      );
      const analysisData = await analysisResponse.json();
      setAnalysisResult(analysisData);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6 overscroll-x-none'>
      {/* Title Card */}
      <div className='p-6 bg-white/50 dark:bg-gray-800/50  rounded-lg shadow-lg'>
        <h1 className='text-2xl text-green-700 dark:text-green-300'>
          Fluency analyzer
        </h1>
        <p className='py-2 text-white leading-8'>
          Click the button below to generate topic suggestions, pick a topic,
          and upload a 1-minute recording of yourself speaking on it.
          <br /> The AI will analyze your speech and provide actionable insights
          to help you improve your fluency and communication skills.
        </p>

        <PromptMediaUpload onFileSelect={handleFileSelect} />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className='flex flex-col text-white items-center gap-4 justify-center'>
          <p className='text-md font-bold'>
            Please wait a moment while we process {fileName}
          </p>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600'></div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className='p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg'>
          <h2 className='text-xl text-green-700 dark:text-green-300 mb-4'>
            Audio Analysis
          </h2>
          <div className='space-y-2'>
            {analysisResult?.suggestions && (
              <div className='prose dark:prose-invert '>
                <MarkdownPreview
                  source={analysisResult.suggestions}
                  style={{ padding: 16 }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
