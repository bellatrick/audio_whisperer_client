import { useState } from 'react';
import { MediaUpload } from '../src/components/MediaUpload';
import MarkdownPreview from '@uiw/react-markdown-preview';

export const BlogGenerator = () => {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const [fileName, setFileName] = useState('');

  const handleFileSelect = async (file) => {
    setFileName(file.name);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        'https://youtube-whisperer.onrender.com/api/generate-blog',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      setMarkdown(data.markdown);
    } catch (error) {
      console.error('Error generating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6 overscroll-x-none'>
      {/* Title Card */}
      <div className='p-6 bg-white/50 dark:bg-gray-800/50  rounded-lg shadow-lg'>
        <h1 className='text-2xl text-green-700 dark:text-green-300'>
          Blog Post Generator
        </h1>
        <p className='py-2 text-white leading-8'>
        This tool enables you to upload a media file and automatically generate a Markdown-formatted tutorial blog based on the audio transcript extracted from the media.
        </p>
        <MediaUpload onFileSelect={handleFileSelect} />
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

      {markdown?.message && (
        <div>
          <p className='text-green-700 dark:text-green-300 text-center text-lg py-4'>
            {markdown.message}
          </p>
        </div>
      )}

      {/* Markdown Content */}
      {markdown && (
        <div className='space-y-4'>
          {/* Tabs */}
          <div className='flex justify-center'>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-l-lg ${
                activeTab === 'preview'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-4 py-2 rounded-r-lg ${
                activeTab === 'raw'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          {/* Tab Content */}
          <div className='p-6  bg-gray-800/50 text-white  rounded-lg shadow-lg'>
            {activeTab === 'preview' && (
              <div className='prose dark:prose-invert '>
                <MarkdownPreview source={markdown} style={{ padding: 16 }} />
              </div>
            )}
            {activeTab === 'raw' && (
              <pre className='whitespace-pre-wrap font-mono text-sm'>
                {markdown}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
