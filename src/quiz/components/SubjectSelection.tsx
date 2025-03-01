import { useState, useEffect } from 'react';
import { Brain, Clock, LogOut, Plus, Search, ArrowRight, Sparkles, Database, Server, Zap, Code } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';
import { subjects } from '../config/constants';
import { motion } from 'framer-motion';

interface SubjectSelectionProps {
  store: QuizStore;
  onSelectSubject: () => void;
  onCreateSubject: () => void;
  onLogout: () => void;
}

export function SubjectSelection({ store, onSelectSubject, onCreateSubject, onLogout }: SubjectSelectionProps) {
  const [loading, setLoading] = useState(true);
  const [loadingSubject, setLoadingSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const usedPalettes = new Set();

  useEffect(() => {
    const loadSubjects = async () => {
      await store.loadSubjects();
      setLoading(false);
    };
    loadSubjects();
  }, [store]);

  const handleSubjectSelect = async (subjectId: string) => {
    try {
      setLoadingSubject(subjectId);
      store.state.selectedSubject = subjectId;
      store.loadState(subjectId);

      if (store.state.quizCompleted) {
        store.clearState(subjectId);
        store.state.selectedSubject = subjectId;
        await store.startQuiz(subjectId);
      } else if (store.state.quizStarted) {
        onSelectSubject();
      } else {
        await store.startQuiz(subjectId);
      }

      setLoadingSubject(null);
      onSelectSubject();
    } catch (error) {
      console.error('Error selecting subject:', error);
      alert('Failed to start quiz. Please try again.');
      setLoadingSubject(null);
    }
  };

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-600 to-cyan-500',
      'from-purple-600 to-pink-500',
      'from-emerald-600 to-teal-500',
      'from-orange-600 to-yellow-500',
      'from-red-600 to-rose-500',
      'from-indigo-600 to-violet-500',
      'from-fuchsia-600 to-pink-500',
      'from-amber-600 to-orange-500',
      'from-lime-600 to-green-500',
      'from-sky-600 to-blue-500',
    ];

    let availableGradients = gradients.filter(g => !usedPalettes.has(g));
    if (availableGradients.length === 0) {
      usedPalettes.clear();
      availableGradients = gradients;
    }

    const gradient = availableGradients[Math.floor(Math.random() * availableGradients.length)];
    usedPalettes.add(gradient);
    return gradient;
  };

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          {/* Neural network animation background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl"></div>
            
            {/* Animated nodes and connections */}
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={`node-${i}`}
                className="absolute w-2 h-2 rounded-full bg-white/70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
            
            {/* Animated connection lines */}
            <svg className="absolute inset-0 w-full h-full">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.line
                  key={`line-${i}`}
                  x1={`${Math.random() * 100}%`}
                  y1={`${Math.random() * 100}%`}
                  x2={`${Math.random() * 100}%`}
                  y2={`${Math.random() * 100}%`}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </svg>
          </div>
          
          <div className="relative z-10 p-8 text-center">
            {/* Central processing animation */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 blur-xl"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              
              <div className="relative w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white/80"
                />
                
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-2 border-white/20 border-b-white/60"
                />
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0.8, 1] }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>
              </div>
            </div>
            
            {/* Loading text */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-white mb-4"
            >
              Loading Knowledge Base
            </motion.h2>
            
            {/* Loading steps */}
            <div className="space-y-3 max-w-xs mx-auto text-left">
              <LoadingStep 
                icon={<Database className="w-4 h-4" />}
                text="Connecting to subject database" 
                delay={0.2} 
              />
              <LoadingStep 
                icon={<Server className="w-4 h-4" />}
                text="Retrieving subject categories" 
                delay={1.0} 
              />
              <LoadingStep 
                icon={<Code className="w-4 h-4" />}
                text="Preparing quiz interface" 
                delay={1.8} 
              />
              <LoadingStep 
                icon={<Brain className="w-4 h-4" />}
                text="Initializing knowledge matrix" 
                delay={2.6} 
              />
            </div>
            
            {/* Binary data stream effect */}
            <div className="mt-6 overflow-hidden h-6 relative">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 8,
                  ease: "linear"
                }}
                className="whitespace-nowrap text-xs font-mono text-indigo-300/70"
              >
                {Array.from({ length: 50 }).map(() => 
                  Math.random() > 0.5 ? "1" : "0"
                ).join(" ")}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col gap-6 mb-12"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-300">
              Welcome back, {store.state.playerName}!
            </h2>
            <p className="text-white/80">Choose a subject to start your quiz journey</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4  backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..."
              className="w-full px-5 py-3 pl-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-white placeholder-white/50 transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
          </div>

          {store.state.playerName === 'admin@quiz' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateSubject}
              className="flex items-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Subject
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center px-5 py-3 bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="whitespace-nowrap">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {filteredSubjects.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="text-center py-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10"
        >
          <Sparkles className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No subjects found</h3>
          <p className="text-white/70">Try a different search term</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredSubjects.map((subject, index) => {
            const gradient = getRandomGradient();
            const isLoading = loadingSubject === subject.id;
            
            return (
              <motion.div
                key={subject.id}
                variants={itemVariants}
                className="group"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <button
                  onClick={() => handleSubjectSelect(subject.id)}
                  disabled={isLoading}
                  className={`w-full h-full rounded-2xl p-6 transition-all duration-500
                           relative overflow-hidden
                           bg-gradient-to-r ${gradient} ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
                >
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Animated background shapes */}
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-xl transform group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-white/10 rounded-full blur-xl transform group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/20
                                   flex items-center justify-center transform group-hover:scale-110 transition-all duration-500
                                   group-hover:rotate-6 shadow-lg shadow-black/20">
                        <Brain className={`w-7 h-7 text-white transform group-hover:-rotate-6 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1 transform group-hover:translate-x-2 transition-transform duration-500">
                          {subject.name}
                        </h3>
                        <div className="flex items-center text-sm text-white/80">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{subject.timeInMinutes * 2} mins</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden mb-6">
                      <div className={`h-full bg-white/40 transition-all duration-1000 ease-out ${isLoading ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-white/90">
                      <div className="flex items-center text-sm">
                        <Brain className="w-4 h-4 mr-1" />
                        <span>{subject.questions} questions</span>
                      </div>
                      <div className="flex items-center font-medium">
                        <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-500">
                          {isLoading ? 'Loading...' : 'Start'}
                        </span>
                        {!isLoading && (
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

function LoadingStep({ icon, text, delay }: { icon: React.ReactNode, text: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/80">{text}</span>
          <LoadingIndicator delay={delay} />
        </div>
        <motion.div 
          className="h-1 bg-indigo-900/30 rounded-full mt-1 overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: delay + 0.2, duration: 1.5 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: delay + 0.2, duration: 1.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function LoadingIndicator({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
      }}
      transition={{ 
        delay,
        duration: 1.5,
        times: [0, 0.5, 1],
        repeat: 0,
      }}
      className="flex items-center"
    >
      <Zap className="w-4 h-4 text-indigo-400" />
    </motion.div>
  );
}