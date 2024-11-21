import { useState } from 'react';
import { MediaUpload } from '../src/components/MediaUpload';
import LanguageCodeDropdown from '../src/components/LanguageInput';

export const SubtitleGenerator = () => {
  const [srtContent, setSrtContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');

  const handleFileSelect = async (file) => {
    setLoading(true);
    if (!targetLanguage) {
      alert('Please select a target language.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_language', targetLanguage);

      const response = await fetch(
        'https://youtube-whisperer.onrender.com/api/generate-subtitle',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      setSrtContent(data);

    } catch (error) {
      console.error('Error translating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (content) => {
    const blob = new Blob([content], { type: 'text/srt' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.srt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className='space-y-6'>
      {/* Translation Tool Card */}
      <div className='p-6 shadow-md rounded-lg'>
        <h2 className='text-2xl font-semibold text-green-700 dark:text-green-300'>
          Subtitle Generator
        </h2>
        <p className='py-2 text-white leading-8'>
            This generates a subtitle file for your transcript and a translation to any language of your choice.
          </p>
        <LanguageCodeDropdown defaultLanguage='en' setTargetLanguage={setTargetLanguage} />

        <MediaUpload onFileSelect={handleFileSelect} />

      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className='flex justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600'></div>
        </div>
      )}
           {srtContent?.message && (
        <div>
          <p className='text-green-700 dark:text-green-300 text-center text-lg py-4'>
            {srtContent.message}
          </p>
        </div>
      )}

      <div className='flex w-full flex-col gap-4 md:flex-row justify-between'>
        {srtContent?.subtitle && (
          <div className='p-6 w-full bg-gray-800/50  shadow-md rounded-lg'>
            <div className='flex flex-row items-center justify-between'>
              <h3 className='text-xl font-semibold text-green-700 dark:text-green-300'>
                Transcript subtitle Result
              </h3>
              <button
                onClick={()=>handleDownload(srtContent.subtitle)}
                className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M10 3a1 1 0 00-1 1v7H7a1 1 0 00-.707 1.707l3 3a1 1 0 001.414 0l3-3A1 1 0 0013 11h-2V4a1 1 0 00-1-1z' />
                  <path d='M3 15a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 11-2 0v-1H5v1a1 1 0 11-2 0v-2z' />
                </svg>
                Download SRT
              </button>
            </div>
            <pre className='whitespace-pre-wrap text-white font-mono text-sm max-h-96 overflow-y-auto mt-4'>
              {srtContent.subtitle}
            </pre>
          </div>
        )}
          {srtContent?.translation && (
          <div className='p-6 w-full bg-gray-800/50  shadow-md rounded-lg'>
            <div className='flex flex-row items-center justify-between'>
              <h3 className='text-xl font-semibold text-green-700 dark:text-green-300'>
                Translation subtitle Result
              </h3>
              <button
                onClick={()=>handleDownload(srtContent?.translation)}
                className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M10 3a1 1 0 00-1 1v7H7a1 1 0 00-.707 1.707l3 3a1 1 0 001.414 0l3-3A1 1 0 0013 11h-2V4a1 1 0 00-1-1z' />
                  <path d='M3 15a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 11-2 0v-1H5v1a1 1 0 11-2 0v-2z' />
                </svg>
                Download translation SRT
              </button>
            </div>
            <pre className='whitespace-pre-wrap text-white font-mono text-sm max-h-96 overflow-y-auto mt-4'>
              {srtContent?.translation}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
