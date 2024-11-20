// App.jsx
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { BlogGenerator } from '../pages/BlogGenerator';
import { ContentAnalyzer } from '../pages/ContentAnalyzer';
import { TranslationTool } from '../pages/TranslationGenerator';
import { FluencyAnalyzer } from '../pages/FluencyAnalyzer';
import Navbar from './components/Navbar';
import { SubtitleGenerator } from '../pages/SubtitleGenerator';

const App = () => {
  return (
    <Router>
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800'>
        <Navbar />
        <main className='max-w-screen overflow-x-hidden mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Routes>
            <Route path='/' element={<BlogGenerator />} />
            <Route path='/analyzer' element={<ContentAnalyzer />} />
            <Route path='/translator' element={<TranslationTool />} />
            <Route path='/fluency-analyzer' element={<FluencyAnalyzer />} />
            <Route path='/subtitle' element={<SubtitleGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
