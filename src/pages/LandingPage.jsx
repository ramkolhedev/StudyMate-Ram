import React, { useEffect, useState } from "react";
import Header from '../components/Header'
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Note from "../assets/Note.png";
import Task from "../assets/Task.png";
import Timer from "../assets/Timer.png";


function LandingPage() {
   const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLogin(!!user); // true if logged in, false otherwise
    });
    return unsubscribe; // cleanup listener
  }, []);

  return (
    <div>
      <Header />
      {/* Hero Section */}
      <section className="min-h-screen bg-[#0a0c12] text-gray-100 mt-10 flex flex-col items-center justify-center text-center ">

        <div className="w-full flex flex-col justify-center items-center bg-[url(https://t4.ftcdn.net/jpg/02/00/68/69/360_F_200686969_GJ7zbz2qaNIE4dyHSbZkQXvNPzRuwlr3.jpg)] bg-cover bg-bg-center  ">
          <div className="w-full flex flex-col justify-center items-center  bg-black/50 py-10 md:pt-30">
            <h1 className="text-5xl font-bold text-sky-400 mt-14 md:mt-0 mb-6"><span className="text-white">Welcome to </span>StudyMate</h1>
            <p className="max-w-2xl mb-10 text-gray-400 font-bold tracking-wide px-3">
              Your personal study assistant to manage tasks, notes, and focus sessions effectively.
            </p>

            <div className="flex gap-4 mb-12">
              <Link to="/login" className="bg-sky-600 hover:bg-sky-900 text-white px-6 py-3 rounded-lg font-medium">Login</Link>
              <Link to="/register" className="border border-sky-600 text-sky-600 hover:bg-sky-600/20 hover:text-white px-6 py-3 rounded-lg font-medium">Register</Link>
            </div>
          </div>
        </div>
        
        <h1 className="font-bold text-4xl mt-10 mb-4 md:mb-7">What you can do</h1>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 w-full mt-5 px-10">

          {/* Tasks */}
          <div className="grid grid-cols-3  bg-black/50 backdrop-blur-xl p-6 rounded-xl shadow-md">
            <div className="">
              <img width={'100px'} src={Task} alt="Task" />
            </div>
            <div className="justify-items-start col-span-2">
              <h3 className="text-2xl font-semibold mb-2">Tasks</h3>
              <p className="text-gray-400 mb-4 text-left">Organize assignments and deadlines in one place.</p>
              {userLogin ? (
                <Link to="/tasks" className="text-sky-600 hover:underline">Go to Tasks →</Link>
              ) : (
                <Link to="/login" className="text-red-400 hover:underline">Login to access →</Link>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-3 bg-black/50 backdrop-blur-xl p-6 rounded-xl shadow-md">
            <div className="">
              <img width={'100px'} src={Note} alt="Task" />
            </div>
            <div className="justify-items-start col-span-2">
              <h3 className="text-2xl font-semibold mb-2">Notes</h3>
              <p className="text-gray-400 mb-4 text-left">Save and access all your study notes anytime.</p>
               {userLogin ? (
                <Link to="/notes" className="text-sky-600 hover:underline">Go to Notes →</Link>
              ) : (
                <Link to="/login" className="text-red-400 hover:underline">Login to access →</Link>
              )}
            </div>
          </div>

          {/* Study Timer */}
          <div className="grid grid-cols-3 bg-black/50 backdrop-blur-xl p-6 rounded-xl shadow-md">
            <div className="">
              <img width={'100px'} src={Timer} alt="Timer" />
            </div>
            <div className="justify-items-start col-span-2">
              <h3 className="text-2xl font-semibold mb-2">Study Timer</h3>
              <p className="text-gray-400 mb-4 text-left">Stay focused using our built-in Pomodoro timer.</p>
               {userLogin ? (
                <Link to="/timer" className="text-sky-600 hover:underline">Go to Timer →</Link>
              ) : (
                <Link to="/login" className="text-red-400 hover:underline">Login to access →</Link>
              )}
            </div>



          </div>
        </div>
        {/* Footer Tagline */}
        <footer className=" text-gray-500 font-bold tracking-wider my-10">
          Built to make your study sessions productive ✨
        </footer>
      </section>
      <Footer/>
    </div>
  );
}

export default LandingPage;