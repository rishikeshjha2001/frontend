"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white overflow-hidden relative">
      {/* Background confetti / floating elements */}
      {mounted && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-rose-600/20 mix-blend-screen"
          style={{
            width: Math.random() * 100 + 20,
            height: Math.random() * 100 + 20,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -100 - 50],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.5, 0],
            scale: [1, Math.random() + 1]
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="z-10 text-center"
      >
        <motion.h1 
          className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-purple-600"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          404
        </motion.h1>
        <h2 className="text-3xl font-bold mt-4 mb-2">Lost in the party?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We can't seem to find the page you're looking for. It might have been moved or the party is somewhere else!
        </p>
        
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(225, 29, 72, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-rose-600 rounded-full font-bold text-lg shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all"
          >
            Take Me Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
