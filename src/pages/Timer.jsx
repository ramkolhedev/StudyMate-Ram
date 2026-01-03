import React, { useState, useEffect, useRef } from "react";
import LoginHeader from "../login/LoginHeader";
import Footer from "../components/Footer";

function Timer() {
  const [time, setTime] = useState(25 * 60); 
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus"); 
  const audioRef = useRef(new Audio("/alarm.wav")); 

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      audioRef.current.play();
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    if (mode === "focus") setTime(25 * 60);
    if (mode === "short") setTime(5 * 60);
    if (mode === "long") setTime(15 * 60);
    setIsRunning(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === "focus") setTime(25 * 60);
    if (newMode === "short") setTime(5 * 60);
    if (newMode === "long") setTime(15 * 60);
  };

  return (

    <div className="min-h-screen bg-[url(https://t4.ftcdn.net/jpg/02/00/68/69/360_F_200686969_GJ7zbz2qaNIE4dyHSbZkQXvNPzRuwlr3.jpg)] text-gray-100 flex flex-col items-center justify-center">
      <LoginHeader />
      <div className="flex flex-col grow items-center justify-center ">
        <h1 className="text-4xl font-bold md:text-sky-600 mb-10 mt-32 md:mt-24 text-center">Pomodoro Timer</h1>

        {/* Mode Switch Buttons */}
        <div className="flex gap-4 mb-8 p-3">
          <button
            onClick={() => switchMode("focus")}
            className={`px-5 py-2 rounded-lg font-semibold cursor-pointer transition ${mode === "focus"
                ? "bg-gray-600 text-white"
                : "bg-transparent border hover:bg-gray-700/40 text-gray-300"
              }`}
          >
            Focus
          </button>
          <button
            onClick={() => switchMode("short")}
            className={`px-5 py-2 rounded-lg font-semibold cursor-pointer transition ${mode === "short"
                ? "bg-gray-600 text-white"
                : "bg-transparent border hover:bg-gray-700/40 text-gray-300"
              }`}
          >
            Short Break
          </button>
          <button
            onClick={() => switchMode("long")}
            className={`px-5 py-2 rounded-lg font-semibold cursor-pointer transition ${mode === "long"
                ?"bg-gray-600 text-white"
                : "bg-transparent border hover:bg-gray-700/40 text-gray-300"
              }`}
          >
            Long Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-7xl font-mono font-bold mb-8">
          {formatTime(time)}
        </div>

        {/* Controls */}
        <div className="flex gap-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-xl font-semibold text-lg cursor-pointer transition ${isRunning
                ? "bg-indigo-300 text-black hover:bg-sky-600"
                : "bg-sky-400 hover:bg-sky-900"
              }`}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-xl font-semibold text-lg bg-transparent border cursor-pointer hover:bg-gray-200/20"
          >
            Reset
          </button>
        </div>

        <p className="mt-10 text-gray-200 italic tracking-wide">
          {mode === "focus"
            ? "Stay focused — you’ve got this!"
            : mode === "short"
              ? "Take a short break — stretch a little "
              : "Relax deeply — you deserve a long break "}
        </p>
      </div>

      {/* Footer fixed at bottom */}
      <div className="w-full">
        <Footer />
      </div>
    </div>

  );
}

export default Timer;
