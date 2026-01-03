import React from 'react'
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
function Header() {


    return (
        <div>
            <header className="flex items-center justify-between px-6 py-4 bg-gray-950 shadow-md shadow-gray-400/10 fixed top-0 left-0 right-0 z-40 border-b border-gray-400/30">
                <div className="flex items-center gap-3">
                    <img src={logo} style={{borderRadius:'50%'}}   width={'50px'} alt="" />

                    <Link to="/" className="text-xl font-semibold text-sky-400">
                        StudyMate
                    </Link>
                </div>

                <div className='md:flex gap-2 hidden'>
                    <Link to={'/login'}>
                        <button
                            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                        >
                            Login
                        </button>
                    </Link>

                    <Link to={'/register'}>
                        <button
                            className="bg-transparent border border-white text-white px-4 py-2 rounded-lg hover:bg-blue-200/10 transition cursor-pointer"
                        >
                            Register
                        </button>
                    </Link>

                </div>
            </header>
        </div>
    )
}

export default Header
