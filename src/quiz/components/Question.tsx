import { useEffect, useState } from 'react';
import { Home, Clock, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionProps {
  store: QuizStore;
  onComplete: () => void;
  onHome: () => void;
}

export function Question({ store, onComplete, onHome }: QuestionProps) {
  const [, setForceUpdate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setForceUpdate({});
    });

    const timer = setInterval(() => {
      store.state.timeLeft--;
      if (store.state.timeLeft <= 0) {
        completeQuiz();
      }
      store.saveState(store.state.selectedSubject);
    }, 1000);

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const completeQuiz = async () => {
    setIsLoading(true);
    await store.completeQuiz();
    setIsLoading(false);
    onComplete();
  };

  const handleSelectAnswer = async (index: number) => {
    setIsLoading(true);
    await store.selectAnswer(index);
    setIsLoading(false);
  };

  const previousQuestion = async () => {
    setIsLoading(true);
    await store.previousQuestion();
    setIsLoading(false);
  };

  const nextQuestion = async () => {
    setIsLoading(true);
    if (!store.nextQuestion()) {
      await completeQuiz();
    }
    setIsLoading(false);
  };

  const handleHome = () => {
    store.saveState(store.state.selectedSubject);
    onHome();
  };

  const question = store.state.questions[store.state.currentQuestion];
  const minutes = Math.floor(store.state.timeLeft / 60);
  const seconds = store.state.timeLeft % 60;
  const currentAnswer = store.state.answers[store.state.currentQuestion];
  const timePercentage = (store.state.timeLeft / (store.state.questions.length * 60)) * 100;
  const isTimeWarning = timePercentage < 30;
  const isTimeCritical = timePercentage < 15;

  if (!question || isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-lg">
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-[spin_3s_linear_infinite]"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-[spin_2s_linear_infinite]"></div>
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 animate-pulse flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{store.state.currentQuestion + 1}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Loading Question...
          </div>
          <div className="mt-4 w-64 h-2 mx-auto bg-gray-700/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-loading"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top navigation bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleHome}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
            title="Go to Home"
          >
            <Home className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col">
            <span className="text-white/70 text-sm">Question</span>
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">{store.state.currentQuestion + 1}</span>
              <span className="text-white/50 mx-1">/</span>
              <span className="text-white/70">{store.state.questions.length}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className={`flex items-center gap-2 px-5 py-2 rounded-xl ${
            isTimeCritical 
              ? 'bg-red-500/20 text-red-300' 
              : isTimeWarning 
                ? 'bg-orange-500/20 text-orange-300' 
                : 'bg-white/10 text-white'
          } transition-colors duration-300`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg font-bold">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
          
        </div>
      </motion.div>
      
      {/* Progress bar */}
      <motion.div 
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden"
      >
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((store.state.currentQuestion + 1) / store.state.questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
        />
      </motion.div>
      
      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl mb-8"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white leading-tight">
            {question.question}
          </h2>
          
          <button
            onClick={() => setShowHint(!showHint)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 flex-shrink-0 ml-4"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-indigo-900/30 rounded-xl p-4 mb-6 border border-indigo-500/20"
            >
              <p className="text-indigo-200 text-sm">
                {question.explanation || "Think carefully about the question. Consider all options before selecting your answer."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Options */}
      <div className="space-y-4 mb-8">
        {question.options.map((option: string, index: number) => (
          <motion.button
            key={index}
            
            onClick={() => handleSelectAnswer(index)}
            className={`group w-full p-5 text-left rounded-xl border transition-all duration-300 relative overflow-hidden ${
              currentAnswer === index
                ? 'border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                : 'border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            <div className="flex items-center">
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-base
                ${currentAnswer === index
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white group-hover:bg-white/20'
                } transition-colors duration-300`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="ml-4 text-base">
                {option}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-between items-center"
      >
        {store.state.currentQuestion > 0 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={previousQuestion}
            className="flex items-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </motion.button>
        ) : <div></div>}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextQuestion}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-600/20"
        >
          {store.state.currentQuestion === store.state.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          {store.state.currentQuestion < store.state.questions.length - 1 && (
            <ArrowRight className="w-5 h-5 ml-2" />
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}