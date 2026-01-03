import React from 'react'
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div>
         <footer className="bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left - Logo */}
        <Link to="/" className="text-xl font-semibold text-sky-600 dark:text-sky-400 mb-4 md:mb-0">
          StudyMate
        </Link>

        {/* Center - Links */}
        <div className="flex space-x-6 text-gray-600 dark:text-gray-400">
          <Link to="/about" className="hover:text-sky-400">About</Link>
          <Link to="/privacy" className="hover:text-sky-400">Privacy</Link>
          <Link to="/contact" className="hover:text-sky-400">Contact</Link>
        </div>

        {/* Right - Copyright */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 md:mt-0">
         Copyright {new Date().getFullYear()} © StudyMate. All rights reserved.
        </p>
      </div>
    </footer>
    </div>
  )
}

export default Footer
