import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function MenuBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setThemeById, themes } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Always Visible Menu Button */}
      <div className="fixed top-2 right-4 z-50">
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
            isOpen 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
              : scrolled 
                ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white' 
                : 'bg-white/20 backdrop-blur-md border border-white/20 text-white'
          }`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute top-16 right-0 p-2 rounded-2xl shadow-xl backdrop-blur-xl border border-white/10 bg-black/30 w-72"
            >
              <div className="flex flex-col gap-2">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-medium text-white">Themes</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-2 px-4">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setThemeById(t.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                        theme.id === t.id 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                          : 'hover:bg-white/10 text-white/80 hover:text-white'
                      }`}
                    >
                      {t.id === 'light' ? <Sun className="h-5 w-5" /> : t.id === 'dark' ? <Moon className="h-5 w-5" /> : <Palette className="h-5 w-5" />}
                      <span className="text-xs">{t.name}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/10 my-2" />
                <div className="px-4 py-3">
                  <p className="text-xs flex items-center justify-center gap-1 text-white/60">
                    Made with ❤️ by TAB
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}