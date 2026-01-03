
import React from "react";
import { Link } from "react-router-dom";
import { X, Home, ClipboardList, Book, Clock } from "lucide-react";

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div>
      <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-sky-400">StudyMate</h2>
        <button onClick={toggleSidebar}>
          <X size={22} />
        </button>
      </div>

      <nav className="flex flex-col space-y-2 px-4 py-4">
        <Link
          to="/dashboard"
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-sky-400 rounded-lg"
        >
          <Home size={18} /> Dashboard
        </Link>
        <Link
          to="/tasks"
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-sky-400 rounded-lg"
        >
          <ClipboardList size={18} /> Tasks
        </Link>
        <Link
          to="/notes"
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-sky-400 rounded-lg"
        >
          <Book size={18} /> Notes
        </Link>
        <Link
          to="/timer"
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-sky-400 rounded-lg"
        >
          <Clock size={18} /> Study Timer
        </Link>
      </nav>
    </aside>
    </div>
  )
}

export default Sidebar
