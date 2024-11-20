import { useState } from 'react';
import { MediaUpload } from './MediaUpload';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const ContentAnalyzer = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('')


  const handleFileSelect = async (file) => {
    setFileName(file.name)
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        'https://youtube-whisperer.onrender.com/api/analyze-content',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header Card */}
      <div className='rounded-lg shadow-md bg-white p-6 dark:bg-gray-800'>
        <h2 className='text-2xl font-semibold text-green-700 dark:text-green-300'>
          Content Analyzer
        </h2>
        <div className='mt-4'>
          <MediaUpload onFileSelect={handleFileSelect} />
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className='flex flex-col text-white items-center gap-4 justify-center'>
            <p className='text-md font-bold'>Please wait a moment while we process {fileName} </p>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600'></div>
        </div>
      )}
      {analysisData?.message && (
        <div>
          <p className='text-green-700 dark:text-green-300 text-center text-lg py-4'>{analysisData.message}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisData?.wordFrequency?.length > 1 && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Word Frequency Chart */}
          <div className='rounded-lg shadow-md bg-white p-6 dark:bg-gray-800'>
            <h3 className='text-xl font-semibold text-green-100'>
              Word Frequency
            </h3>
            <div className='h-80 mt-4'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={analysisData.wordFrequency}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='word' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='frequency' fill='#059669' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Flagged Content Timestamps */}
          <div className='rounded-lg shadow-md bg-white p-6 dark:bg-gray-800'>
            <h3 className='text-xl font-semibold text-green-100'>
              Flagged Content Timestamps
            </h3>
            <div className='mt-4 overflow-x-auto'>
              <table className='w-full table-auto border-collapse'>
                <thead>
                  <tr className='border-b text-green-500 border-green-200 dark:border-green-800'>
                  <th className='py-2 px-4 text-left'>S/N</th>
                    <th className='py-2 px-4 text-left'>Word</th>

                    <th className='py-2 px-4 text-left'>Time Start</th>
                    <th className='py-2 px-4 text-left'>Time End</th>
                    <th className='py-2 px-4 text-left'>Severity</th>
                  </tr>
                </thead>
                <tbody className='text-white'>
                  {analysisData.timestamps.map((item, index) => (
                    <tr
                      key={index}
                      className='border-b capitalize border-green-100 dark:border-green-900'
                    >
                        <td className='py-2 px-4'>{index+1}</td>
                      <td className='py-2 px-4'>{item.word}</td>
                      <td className='py-2 px-4'>{item.time_start}</td>
                      <td className='py-2 px-4'>{item.time_end}</td>

                      <td className='py-2 px-4'>{item.severity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
