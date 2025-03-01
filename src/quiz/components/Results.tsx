import { useState, useEffect } from 'react';
import { BookOpen, RefreshCcw, Home, Award, Share2, Download, Trophy, Users, Star, CheckCircle, XCircle, BarChart, ArrowUpRight } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultsProps {
  store: QuizStore;
  onReview: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export function Results({ store, onReview, onRestart, onHome }: ResultsProps) {
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState(0);
  const [activeTab, setActiveTab] = useState<'score' | 'leaderboard'>('score');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      const calculatedScore = store.calculateScore();
      setScore(calculatedScore);
      const calculatedPercentage = Math.round((calculatedScore / store.state.questions.length) * 100);
      setPercentage(calculatedPercentage);
      
      // Show confetti for good scores
      if (calculatedPercentage >= 70) {
        setShowConfetti(true);
      }

      const leaderboardData = await store.getLeaderboard();
      setLeaderboard(leaderboardData);
      setUserRank(leaderboardData.findIndex(entry => entry.name === store.state.playerName) + 1);
    };

    loadResults();
  }, [store]);

  const getScoreMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a master of this subject!";
    if (percentage >= 80) return "Excellent work! You really know your stuff!";
    if (percentage >= 70) return "Great job! You have a solid understanding!";
    if (percentage >= 60) return "Good effort! Keep learning and improving!";
    if (percentage >= 50) return "Not bad! You're on the right track!";
    return "Keep practicing! You'll improve with more study!";
  };

  const getScoreColor = () => {
    if (percentage >= 80) return "from-emerald-500 to-green-500";
    if (percentage >= 60) return "from-blue-500 to-indigo-500";
    if (percentage >= 40) return "from-amber-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreEmoji = () => {
    if (percentage >= 90) return "🏆";
    if (percentage >= 80) return "🌟";
    if (percentage >= 70) return "🎉";
    if (percentage >= 60) return "👍";
    if (percentage >= 50) return "😊";
    return "📚";
  };

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

  const renderScoreTab = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Score Circle */}
      <motion.div 
        variants={itemVariants}
        className="relative flex flex-col items-center"
      >
        <div className="relative w-48 h-48 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-2xl"></div>
          <div className="relative w-full h-full">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={percentage >= 80 ? "#10B981" : percentage >= 60 ? "#3B82F6" : percentage >= 40 ? "#F59E0B" : "#EF4444"} />
                  <stop offset="100%" stopColor={percentage >= 80 ? "#059669" : percentage >= 60 ? "#4F46E5" : percentage >= 40 ? "#D97706" : "#DB2777"} />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - percentage / 100)}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <foreignObject x="0" y="0" width="100" height="100">
                <div className="h-full flex flex-col items-center justify-center">
                  <motion.span 
                    className="text-xl font-bold text-white"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {percentage}%
                  </motion.span>
                  <motion.span 
                    className="text-xl text-white/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    {getScoreEmoji()}
                  </motion.span>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
        
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
            {store.state.playerName}
          </h2>
          <p className="text-white/80 mb-2">
            Rank #{userRank} • {score}/{store.state.questions.length} correct
          </p>
          <p className="text-lg text-white/90 mb-6 max-w-md mx-auto">
            {getScoreMessage()}
          </p>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
       <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/20">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-white/80 text-sm">Correct</span>
          </div>
          <p className="text-2xl font-bold text-white">{score}</p>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/20  backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/20">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-white/80 text-sm">Incorrect</span>
          </div>
          <p className="text-2xl font-bold text-white">{store.state.questions.length - score}</p>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <BarChart className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-white/80 text-sm">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-white">{percentage}%</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-wrap gap-4 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReview}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <BookOpen className="w-5 h-5" />
          Review Answers
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-2 border border-white/10"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Share functionality - could be implemented with Web Share API
            if (navigator.share) {
              navigator.share({
                title: 'My Quiz Result',
                text: `I scored ${percentage}% on the ${store.state.selectedSubject} quiz!`,
                url: window.location.href,
              }).catch(err => {
                console.log('Error sharing:', err);
              });
            } else {
              alert('Sharing is not available in your browser');
            }
          }}
          className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-2 border border-white/10"
        >
          <Share2 className="w-5 h-5" />
          Share Result
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const renderLeaderboardTab = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.h3 
        variants={itemVariants}
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300"
      >
        Top Performers
      </motion.h3>
      
      <motion.div 
        variants={itemVariants}
        className="space-y-3"
      >
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <Trophy className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/70">No leaderboard data available yet</p>
          </div>
        ) : (
          leaderboard.slice(0, 10).map((entry, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`flex items-center p-4 rounded-xl ${
                entry.name === store.state.playerName
                  ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-gradient-to-r from-indigo-600/10 to-purple-600/20 backdrop-blur-md text-white border border-white/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index === 0 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500' 
                  : index === 1 
                    ? 'bg-gradient-to-r from-slate-400 to-slate-500' 
                    : index === 2 
                      ? 'bg-gradient-to-r from-amber-700 to-amber-800'
                      : entry.name === store.state.playerName 
                        ? 'bg-white/20' 
                        : 'bg-white/10'
              } mr-4 font-bold text-white`}>
                {index < 3 ? (
                  <Star className="w-5 h-5" fill={index === 0 ? "#FCD34D" : index === 1 ? "#E5E7EB" : "#B45309"} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium">{entry.name}</span>
                  {entry.name === store.state.playerName && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">You</span>
                  )}
                </div>
                <div className="text-sm text-white/70">
                  {Math.round((entry.score / store.state.questions.length) * 100)}% accuracy
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{entry.score}</span>
                <span className="text-white/70">pts</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
      
      {leaderboard.length > 0 && (
        <motion.div 
          variants={itemVariants}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-2 border border-white/10"
          >
            <ArrowUpRight className="w-5 h-5" />
            View Full Leaderboard
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const createConfetti = () => {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.inset = '0';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '100';
        document.body.appendChild(confettiContainer);

        const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
        
        for (let i = 0; i < 150; i++) {
          setTimeout(() => {
            const confetti = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.position = 'absolute';
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 5 + 5}px`;
            confetti.style.backgroundColor = color;
            confetti.style.borderRadius = '2px';
            confetti.style.opacity = '0.8';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-20px';
            
            confettiContainer.appendChild(confetti);
            
            const animationDuration = Math.random() * 3 + 2;
            const xMovement = (Math.random() - 0.5) * 20;
            
            confetti.animate([
              { transform: `translateY(0) rotate(0deg) translateX(0)`, opacity: 0.8 },
              { transform: `translateY(100vh) rotate(${Math.random() * 360}deg) translateX(${xMovement}vw)`, opacity: 0 }
            ], {
              duration: animationDuration * 1000,
              easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
            });
            
            setTimeout(() => {
              confetti.remove();
            }, animationDuration * 1000);
          }, i * 50);
        }
        
        setTimeout(() => {
          confettiContainer.remove();
        }, 8000);
      };
      
      createConfetti();
    }
  }, [showConfetti]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      {/* Tabs */}
      <motion.div 
        variants={itemVariants}
        className="flex mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-lg"
      >
        <button
          onClick={() => setActiveTab('score')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'score' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
              : 'text-white/70 hover:bg-white/10'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Your Score</span>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'leaderboard' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
              : 'text-white/70 hover:bg-white/10'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Leaderboard</span>
        </button>
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        variants={itemVariants}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl"
      >
        <AnimatePresence mode="wait">
          {activeTab === 'score' ? (
            <motion.div
              key="score-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderScoreTab()}
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderLeaderboardTab()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Home Button */}
      <motion.div 
        variants={itemVariants}
        className="fixed bottom-8 right-8"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onHome}
          className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-600/30 transition-all duration-300"
        >
          <Home className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
