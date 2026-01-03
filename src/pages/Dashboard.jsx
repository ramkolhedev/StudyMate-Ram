import React, { useEffect, useState } from "react";
import LoginHeader from "../login/LoginHeader";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ClipboardList, Notebook, Clock } from "lucide-react";
import Note from "../assets/Note.png";
import Timer from "../assets/Timer.png";
import Task from "../assets/Task.png";

function Dashboard() {
  const [taskCount, setTaskCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);
  const [todayTasks, setTodayTasks] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const uid = user.uid;

      const tasksRef = collection(db, "tasks");
      const tasksSnapshot = await getDocs(query(tasksRef, where("uid", "==", uid)));
      setTaskCount(tasksSnapshot.size);

      const notesRef = collection(db, "notes");
      const notesSnapshot = await getDocs(query(notesRef, where("uid", "==", uid)));
      setNotesCount(notesSnapshot.size);

      const today = new Date().toISOString().split("T")[0];
      const todaySnapshot = await getDocs(
        query(tasksRef, where("uid", "==", uid), where("dueDate", "==", today))
      );
      setTodayTasks(todaySnapshot.size);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-gray-800 to-gray-950">
      <LoginHeader />

      <div className="flex flex-col grow mt-20 p-6">
        <h1 className="text-4xl font-extrabold text-white text-center my-10 tracking-wide">
          DASHBOARD
        </h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 max-w-6xl mx-auto">

          {/* Tasks Summary */}
          <div className="bg-[url(https://t4.ftcdn.net/jpg/02/00/68/69/360_F_200686969_GJ7zbz2qaNIE4dyHSbZkQXvNPzRuwlr3.jpg)] rounded-xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="">
              <img width={'100px'} src={Task} alt="Task" />
            </div>
              <h2 className="text-2xl font-semibold text-gray-100">Tasks</h2>
            </div>

            <p className="text-gray-300 text-lg">{taskCount} total tasks</p>
            <p className="text-gray-400 text-lg">{todayTasks} due today</p>

            <Link to={"/tasks"}>
              <button className="mt-5 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition font-medium cursor-pointer">
                View Tasks
              </button>
            </Link>
          </div>

          {/* Notes Summary */}
          <div className="bg-[url(https://t4.ftcdn.net/jpg/02/00/68/69/360_F_200686969_GJ7zbz2qaNIE4dyHSbZkQXvNPzRuwlr3.jpg)] rounded-xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="">
              <img width={'127px'} src={Note} alt="Task" />
            </div>
              <h2 className="text-2xl font-semibold text-gray-100">Notes</h2>
            </div>

            <p className="text-gray-300 text-lg">{notesCount} saved notes</p>

            <Link to={"/notes"}>
              <button className="mt-5 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition font-medium cursor-pointer">
                Open Notes
              </button>
            </Link>
          </div>

          {/* Study Timer */}
          <div className="bg-[url(https://t4.ftcdn.net/jpg/02/00/68/69/360_F_200686969_GJ7zbz2qaNIE4dyHSbZkQXvNPzRuwlr3.jpg)] rounded-xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="">
              <img width={'100px'} src={Timer} alt="Timer" />
            </div>
              <h2 className="text-2xl font-semibold text-gray-100">Study Timer</h2>
            </div>

            <p className="text-gray-300 text-lg">Focus mode available</p>

            <Link to={"/timer"}>
              <button className="mt-5 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition font-medium cursor-pointer">
                Start Timer
              </button>
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
