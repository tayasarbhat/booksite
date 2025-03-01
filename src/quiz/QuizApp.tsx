import { useState, useEffect } from 'react';
import { QuizStore } from './store/QuizStore';
import { NameInput } from './components/NameInput';
import { SubjectSelection } from './components/SubjectSelection';
import { Question } from './components/Question';
import { Results } from './components/Results';
import { Review } from './components/Review';
import { LogoutConfirmation } from './components/LogoutConfirmation';
import { CreateSubject } from './components/CreateSubject';
import { X, ArrowLeft, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizAppProps {
  onClose: () => void;
}

export function QuizApp({ onClose }: QuizAppProps) {
  const [store] = useState(() => new QuizStore());
  const [view, setView] = useState<'welcome' | 'name' | 'subjects' | 'quiz' | 'results' | 'review' | 'create' | 'logout'>('welcome');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Welcome animation timing
    const timer = setTimeout(() => {
      store.loadPlayerName();
      if (store.state.playerName) {
        setView('subjects');
      } else {
        setView('name');
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [store]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const renderView = () => {
    if (view === 'welcome') {
      return (
        <div className="fixed inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div 
              className="w-24 h-24 mx-auto mb-6 relative"
              animate={{ 
                rotate: 360,
                boxShadow: ["0 0 20px rgba(99, 102, 241, 0.5)", "0 0 40px rgba(168, 85, 247, 0.5)", "0 0 20px rgba(99, 102, 241, 0.5)"]
              }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl opacity-70"></div>
              <div className="relative w-full h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <Library className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Knowledge Quiz
            </motion.h1>
            <motion.p 
              className="text-gray-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Test your skills and learn
            </motion.p>
          </motion.div>
        </div>
      );
    }

    switch (view) {
      case 'name':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="name-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <NameInput store={store} onComplete={() => setView('subjects')} />
            </motion.div>
          </AnimatePresence>
        );
      case 'subjects':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="subject-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <SubjectSelection 
                store={store} 
                onSelectSubject={() => setView('quiz')}
                onCreateSubject={() => setView('create')}
                onLogout={() => setView('logout')}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 'quiz':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="quiz-question"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Question 
                store={store} 
                onComplete={() => setView('results')} 
                onHome={() => setView('subjects')}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 'results':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="quiz-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Results 
                store={store} 
                onReview={() => setView('review')}
                onRestart={() => setView('quiz')}
                onHome={() => setView('subjects')}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 'review':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="quiz-review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Review store={store} onBack={() => setView('results')} />
            </motion.div>
          </AnimatePresence>
        );
      case 'create':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="create-subject"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <CreateSubject store={store} onComplete={() => setView('subjects')} />
            </motion.div>
          </AnimatePresence>
        );
      case 'logout':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="logout-confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <LogoutConfirmation 
                onConfirm={() => {
                  store.clearAllData();
                  setView('name');
                }}
                onCancel={() => setView('subjects')}
              />
            </motion.div>
          </AnimatePresence>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Animated background */}
      <div className="fixed inset-0 w-full h-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient">
       
       {/* Static particles */}


      </div>

      {/* Content container with glass effect */}
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Navigation buttons container - fixed at the top */}
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
          {/* Back button - only show on certain views */}
          <div>
            {view !== 'subjects' && view !== 'name' && view !== 'welcome' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                onClick={() => {
                  if (view === 'quiz') setView('subjects');
                  if (view === 'results') setView('subjects');
                  if (view === 'review') setView('results');
                  if (view === 'create') setView('subjects');
                }}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="h-6 w-6" />
              </motion.button>
            )}
          </div>
          
          {/* Close button */}
          <div>
            {view !== 'welcome' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                onClick={handleClose}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <X className="h-6 w-6" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Main content with padding to avoid overlapping with the navigation buttons */}
        <div className="w-full max-w-6xl pt-16">
          {renderView()}
        </div>
      </div>
    </motion.div>
  );
}