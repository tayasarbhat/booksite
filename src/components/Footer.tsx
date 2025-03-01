import { useState, useEffect } from 'react';
import { Heart, Brain, Eye, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

export function Footer() {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
      });
    } else {
      controls.stop();
      controls.start({ scale: 1 });
    }
  }, [isHovered, controls]);

  return (
    <footer className="relative overflow-hidden py-4 mt-auto">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 opacity-50"></div>
      
      {/* Animated particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/40"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * 100 + 50,
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{
            y: [null, Math.random() * -50 - 20],
            opacity: [null, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 5
          }}
        />
      ))}
      
      {/* Interactive glow effect that follows mouse */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x - 128,
          y: mousePosition.y - 128 - window.scrollY
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        style={{ opacity: isHovered ? 0.8 : 0.3 }}
      />
      
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Main footer content */}
        <motion.div
          className="flex flex-col items-center"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div 
            className="flex items-center gap-3 mb-4"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-white/80 text-lg">Made with</span>
            
            <motion.div
              animate={controls}
              className="relative"
            >
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-md"></div>
              <Heart className="h-6 w-6 text-red-400 relative z-10 fill-red-400" />
            </motion.div>
            
            
            
           
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-2">
              Digital Library
            </h3>
            <p className="text-white/60 text-sm max-w-md">
              Explore a world of knowledge at your fingertips. Your gateway to learning and discovery.
            </p>
          </motion.div>
        </motion.div>
        
        {/* Social links */}
        <motion.div 
          className="flex gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: <Github className="h-5 w-5" />, label: "GitHub", href: "https://github.com/tayasarbhat" },
            { icon: <Twitter className="h-5 w-5" />, label: "Twitter", href: "https://x.com/tayasarbhat" },
            { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", href: "https://linkedin.com" }
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {social.icon}
              <span className="sr-only">{social.label}</span>
            </motion.a>
          ))}
        </motion.div>
        
        {/* Copyright */}
        <motion.div
          className="mt-8 text-white/40 text-xs flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span>© {new Date().getFullYear()} Digital Library</span>
          <span className="mx-2">•</span>
          <span>All rights reserved</span>
        </motion.div>
      </div>
    </footer>
  );
}