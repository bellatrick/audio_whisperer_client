import { useState } from 'react';
import { MediaUpload } from './MediaUpload';
import MarkdownPreview from '@uiw/react-markdown-preview';
import LanguageCodeDropdown from './LanguageInput';
import { languages } from 'countries-list';

export const TranslationTool = () => {
  const [content, setcontent] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('transcript');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [fileName, setFileName] = useState('')

  console.log(languages)

  const handleFileSelect = async (file) => {
    setFileName(file.name)
    if (!targetLanguage) {
      alert('Please select a target language.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_language',targetLanguage)

      const response = await fetch(
        'https://youtube-whisperer.onrender.com/api/translate-content',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      setcontent(data);
    } catch (error) {
      console.error('Error translating content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6 p-4'>
      {/* Card Container */}
      <div className='rounded-lg shadow-sm p-4 bg-gray-800'>
        <div className=' pb-2 mb-4'>
          <h1 className='text-2xl font-semibold text-green-700 dark:text-green-300'>
            Translation Tool
          </h1>
          <LanguageCodeDropdown setTargetLanguage={setTargetLanguage} />
        </div>
        <div>
          <MediaUpload onFileSelect={handleFileSelect} />
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className='flex flex-col text-white items-center gap-4 justify-center'>
            <p className='text-md font-bold'>Please wait a moment while we process {fileName}</p>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600'></div>
        </div>
      )}

      {content?.message && (
        <div>
          <p className='text-green-700 dark:text-green-300 text-center text-lg py-4'>
            {content.message}
          </p>
        </div>
      )}
          {content?.language && (
        <div>
          <p className='text-green-700 dark:text-green-300 text-center text-lg py-4'>
           Your uploaded media is in {languages[content.language].name}
          </p>
        </div>
      )}

      {/*  Content */}
      {content?.transcript && (
        <div className='space-y-4'>
          {/* Tabs */}
          <div className='flex justify-center'>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-4 py-2 rounded-l-lg ${
                activeTab === 'transcript'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Transcript
            </button>
            <button
              onClick={() => setActiveTab('translation')}
              className={`px-4 py-2 rounded-r-lg ${
                activeTab === 'translation'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Translation
            </button>
          </div>

          {/* Tab Content */}
          <div className='p-6  bg-gray-800/50 text-white backdrop-blur-sm rounded-lg shadow-lg'>
            {activeTab === 'transcript' && (
              <div className='prose dark:prose-invert '>
                <MarkdownPreview
                  source={content.transcript}
                  style={{ padding: 16 }}
                />
              </div>
            )}
            {activeTab === 'translation' && (
              <div className='prose dark:prose-invert '>
                <MarkdownPreview
                  source={content.translation}
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
