import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { FileText, Download, BookOpen, Clock, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: Book;
  index: number;
  progress: number;
  theme?: any;
}

export function BookCard({ book, index, progress, theme }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, Math.min(index * 50, 500)); // Reduced from 100ms to 50ms, max from 1000ms to 500ms
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (progress > 0) {
      const phase = Math.floor((progress / 100) * 4);
      setLoadingPhase(phase);
    }
  }, [progress]);

  const getImageUrl = (url: string) => {
    const fileIdMatch = url.match(/id=([^&]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`; // Reduced from w800 to w400 for faster loading
    }
    return url;
  };

  if (!book.title || !isLoaded) {
    return (
      <BookCardSkeleton progress={progress} phase={loadingPhase} index={index} />
    );
  }

  const getCategoryGradient = () => {
    const gradients: { [key: string]: string } = {
      'QUANTITATIVE APTITUDE': 'from-blue-600 to-indigo-600',
      'REASONING': 'from-purple-600 to-pink-600',
      'GENERAL KNOWLEDGE': 'from-emerald-600 to-teal-600',
      'GENERAL ENGLISH': 'from-cyan-600 to-blue-600',
      'HISTORY': 'from-amber-600 to-orange-600',
      'GEOGRAPHY': 'from-lime-600 to-green-600',
      'SCIENCE': 'from-sky-600 to-cyan-600',
      'POLITY': 'from-blue-600 to-indigo-600',
      'ECONOMY': 'from-violet-600 to-purple-600',
    };
    return gradients[book.category] || 'from-slate-600 to-gray-600';
  };

  const getCategoryColor = () => {
    const colors: { [key: string]: string } = {
      'QUANTITATIVE APTITUDE': 'bg-blue-500',
      'REASONING': 'bg-purple-500',
      'GENERAL KNOWLEDGE': 'bg-emerald-500',
      'GENERAL ENGLISH': 'bg-cyan-500',
      'HISTORY': 'bg-amber-500',
      'GEOGRAPHY': 'bg-lime-500',
      'SCIENCE': 'bg-sky-500',
      'POLITY': 'bg-indigo-500',
      'ECONOMY': 'bg-violet-500',
    };
    return colors[book.category] || 'bg-slate-500';
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <motion.div 
      className="group h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Card with glass morphism effect */}
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl transition-all duration-500">
        {/* Animated gradient border */}
        <motion.div 
          className="absolute -inset-0.5 rounded-2xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ 
            background: isHovered 
              ? [
                  `linear-gradient(to right, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`,
                  `linear-gradient(to bottom right, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`,
                  `linear-gradient(to bottom, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`,
                  `linear-gradient(to bottom left, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`,
                  `linear-gradient(to left, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`,
                  `linear-gradient(to top left, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`,
                  `linear-gradient(to top, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`,
                  `linear-gradient(to top right, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`,
                  `linear-gradient(to right, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`
                ] 
              : `linear-gradient(to right, rgba(99, 102, 241, 0), rgba(168, 85, 247, 0))`
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Glass background */}
        <div className="relative z-10 flex flex-col h-full backdrop-blur-sm bg-white/10 dark:bg-gray-900/40 border border-white/20 dark:border-white/10 shadow-xl">
          {/* Category badge - positioned absolutely */}
          <div className="absolute top-4 left-4 z-20">
            <div className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor()} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
              {book.category}
            </div>
          </div>

          {/* Save button - positioned absolutely */}
          <button 
            onClick={toggleSave}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors duration-300"
          >
            <Heart 
              className={`h-4 w-4 ${isSaved ? 'text-red-500 fill-red-500' : 'text-white'}`} 
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>

          {/* Cover image with gradient overlay */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient()} opacity-30`}></div>
            
            {/* Image */}
            {!imageError ? (
              <img
                src={getImageUrl(book.coverUrl)}
                alt={book.title}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <BookOpen className="h-12 w-12 text-white/70 mb-2" />
                <span className="text-sm text-white/70">Cover not available</span>
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            
            {/* Book info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3.5 w-3.5 text-white/70" />
                <p className="text-xs text-white/90">by {book.author}</p>
              </div>
              
              {book.fileType && (
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-3.5 w-3.5 text-white/70" />
                  <p className="text-xs text-white/90">{book.fileType} {book.fileSize && `• ${book.fileSize}`}</p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow p-5">
            <h3 className="text-lg font-bold text-white line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors duration-300">
              {book.title}
            </h3>
            
            <p className="text-sm text-white/70 line-clamp-2 mb-4 flex-grow">
              {book.description || "No description available for this book."}
            </p>
            
            {/* Action buttons */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
              {book.driveLink ? (
                <a
                  href={book.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
                >
                  <span>Read Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </a>
              ) : (
                <span className="text-sm text-white/40">Not available</span>
              )}
              
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                
                {book.driveLink && (
                  <a
                    href={book.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Hover glow effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none rounded-2xl z-0"
            animate={{ 
              boxShadow: isHovered 
                ? `0 0 30px 5px rgba(${book.category === 'REASONING' ? '168, 85, 247' : book.category === 'QUANTITATIVE APTITUDE' ? '79, 70, 229' : '16, 185, 129'}, 0.3)` 
                : '0 0 0px 0px rgba(0, 0, 0, 0)'
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

interface SkeletonProps {
  progress: number;
  phase: number;
  index: number;
}

function BookCardSkeleton({ progress, phase, index }: SkeletonProps) {
  const loadingStates = [
    'Fetching books...',
    'Loading details...',
    'Almost ready...',
    'Finalizing...',
  ];

  const delayedProgress = Math.max(0, progress - index * 5);
  const currentLoadingState = loadingStates[phase] || loadingStates[0];

  return (
    <div className="relative h-full">
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
      
      {/* Glass background */}
      <div className="relative h-full backdrop-blur-sm bg-white/10 dark:bg-gray-900/40 border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* Loading progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${delayedProgress}%` }}
          />
        </div>

        {/* Cover image area */}
        <div className="aspect-[4/3] bg-gradient-to-br from-indigo-900/30 to-purple-900/30 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="mt-4 text-sm font-medium text-white/80 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                {currentLoadingState}
              </p>
              <p className="mt-2 text-xs text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                {delayedProgress}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-5 space-y-3">
          <div className="h-6 bg-white/10 rounded-lg w-3/4 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-lg w-1/2 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-lg w-full animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-lg w-2/3 animate-pulse"></div>
          
          <div className="pt-3 mt-3 border-t border-white/10 flex justify-between">
            <div className="h-4 bg-white/10 rounded-lg w-20 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse"></div>
              <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}