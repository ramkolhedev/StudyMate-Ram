import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import swal from "sweetalert";
import { CiMenuBurger } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

function LoginHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to logout?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willLogout) => {
      if (willLogout) {
        try {
          await signOut(auth);
          swal("Success!", "Logout Successful!", "success");
          navigate("/");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      } else {
        swal("Cancelled", "You are still logged in!", "info");
      }
    });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-950 shadow-md shadow-gray-400/10 fixed top-0 left-0 right-0 z-40 border-b border-gray-400/30">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="\src\assets\logo.png"
          style={{ borderRadius: "50%" }}
          width="50px"
          alt=""
        />
        <Link to="/" className="text-xl font-semibold text-sky-400">
          StudyMate
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6">
        <Link to="/dashboard" className="text-white hover:text-sky-400">
          Dashboard
        </Link>
        <Link to="/tasks" className="text-white hover:text-sky-400">
          Tasks
        </Link>
        <Link to="/notes" className="text-white hover:text-sky-400">
          Notes
        </Link>
        <Link to="/timer" className="text-white hover:text-sky-400">
          Timer
        </Link>
      </nav>

      {/* Desktop Logout */}
      <button
        onClick={handleLogout}
        className="hidden md:block bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition cursor-pointer"
      >
        Logout
      </button>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-white text-2xl cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <IoClose /> : <CiMenuBurger />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-20 right-4 bg-gray-900 p-5 rounded-lg shadow-lg w-48 flex flex-col gap-4 md:hidden border border-gray-700">

          <Link
            to="/dashboard"
            className="text-white hover:text-sky-600"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            to="/tasks"
            className="text-white hover:text-sky-600"
            onClick={() => setMenuOpen(false)}
          >
            Tasks
          </Link>

          <Link
            to="/notes"
            className="text-white hover:text-sky-600"
            onClick={() => setMenuOpen(false)}
          >
            Notes
          </Link>

          <Link
            to="/timer"
            className="text-white hover:text-sky-600"
            onClick={() => setMenuOpen(false)}
          >
            Timer
          </Link>

          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default LoginHeader;