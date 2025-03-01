import { useState } from 'react';
import { UserCircle, Brain, Cpu, Zap, Code, Server, Database } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';
import { motion, AnimatePresence } from 'framer-motion';

interface NameInputProps {
  store: QuizStore;
  onComplete: () => void;
}

export function NameInput({ store, onComplete }: NameInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate loading with animation
    setTimeout(() => {
      store.state.playerName = name.trim();
      store.savePlayerName();
      onComplete();
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          {/* Neural network animation background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl"></div>
            
            {/* Animated nodes and connections */}
            {Array.from({ length: 30 }).map((_, i) => (
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
              {Array.from({ length: 20 }).map((_, i) => (
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
              Initializing Quiz System
            </motion.h2>
            
            {/* Loading steps */}
            <div className="space-y-3 max-w-xs mx-auto text-left">
              <LoadingStep 
                icon={<Database className="w-4 h-4" />}
                text="Loading knowledge database" 
                delay={0.2} 
              />
              <LoadingStep 
                icon={<Cpu className="w-4 h-4" />}
                text="Configuring neural networks" 
                delay={1.0} 
              />
              <LoadingStep 
                icon={<Server className="w-4 h-4" />}
                text="Preparing question algorithms" 
                delay={1.8} 
              />
              <LoadingStep 
                icon={<Code className="w-4 h-4" />}
                text="Optimizing user experience" 
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
      className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md mx-auto border border-white/20"
    >
      <motion.div 
        variants={itemVariants}
        className="relative w-32 h-32 mx-auto mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur-xl opacity-70"></div>
        <div className="relative w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
          <UserCircle className="w-16 h-16 text-white" />
        </div>
      </motion.div>
      
      <motion.h2 
        variants={itemVariants}
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-4 text-center"
      >
        Welcome to the Quiz
      </motion.h2>
      
      <motion.p 
        variants={itemVariants}
        className="text-white/80 mb-8 text-lg text-center"
      >
        Enter your name to begin your knowledge journey
      </motion.p>
      
      <motion.form 
        variants={itemVariants}
        onSubmit={handleSubmit} 
        className="max-w-sm mx-auto"
      >
        <div className="relative mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/20 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-lg text-white placeholder-grey/50 transition-all duration-300"
            required
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur opacity-0 transition-opacity duration-300 -z-10 peer-focus:opacity-100"></div>
        </div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-lg font-medium shadow-lg shadow-indigo-600/20"
        >
          Start Quiz
        </motion.button>
      </motion.form>
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