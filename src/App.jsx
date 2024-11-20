// App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BlogGenerator } from './components/BlogGenerator';
import { ContentAnalyzer } from './components/ContentAnalyzer';
import { TranslationTool } from './components/TranslationGenerator';
import { FluencyAnalyzer } from './components/FluencyAnalyzer';


const App = () => {

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-green-200 dark:border-green-900">
          <div className=" max-w-screen md:max-w-7xl flex-col md:flex-row mx-auto flex justify-between items-center gap-4 px-1 sm:px-6 lg:px-8">
            <p className='text-green-200 font-lg font-bold'>AudioWhisperer</p>
            <div className="flex justify-between h-16 items-center">
              <div className="flex md:space-x-8">
                <Link
                  to="/"
                  className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 px-3 py-2 rounded-md text-[12px] md:text-sm font-medium"
                >
                  Blog Generator
                </Link>
                <Link
                  to="/analyzer"
                  className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 px-3 py-2 rounded-md text-[12px] md:text-sm font-medium"
                >
                  Content Analyzer
                </Link>
                <Link
                  to="/translator"
                  className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 px-3 py-2 rounded-md text-[12px] md:text-sm font-medium"
                >
                  Translation Tool
                </Link>
                <Link
                  to="/fluency-analyzer"
                  className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 px-3 py-2 rounded-md text-[12px] md:text-sm font-medium"
                >
                  Fluency Analyzer
                </Link>
              </div>

            </div>
          </div>
        </nav>

        <main className="max-w-screen overflow-x-hidden mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<BlogGenerator />} />
            <Route path="/analyzer" element={<ContentAnalyzer />} />
            <Route path="/translator" element={<TranslationTool />} />
            <Route path="/fluency-analyzer" element={<FluencyAnalyzer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;