// frontend/src/components/ui/SplashScreen.jsx
// Full-screen branded loading screen shown on app start.

import { motion, AnimatePresence } from 'framer-motion';
import { APP_ABBR, APP_NAME } from '../../constants/app';

export default function SplashScreen({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Logo */}
          <motion.div
            className="splash-logo-wrap"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <img src="/PRP_logo.png" alt={`${APP_ABBR} Logo`} />
          </motion.div>

          {/* App name */}
          <motion.h1
            className="splash-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {APP_ABBR}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="splash-subtitle"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            {APP_NAME}
          </motion.p>

          {/* Loading dots */}
          <motion.div
            className="splash-dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="splash-dot" />
            <span className="splash-dot" />
            <span className="splash-dot" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
