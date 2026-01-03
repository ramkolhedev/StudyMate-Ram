import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import swal from 'sweetalert';

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            swal("Success!", "Account Created Successfully!", "success");
            setTimeout(() => {
                navigate("/login");
            }, 1000); // Redirect after 1.5s
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already registered.");
            } else if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else if (err.code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else {
                setError("Failed to create account. Try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[url(https://t4.ftcdn.net/jpg/02/00/68/69/360_F_200686969_GJ7zbz2qaNIE4dyHSbZkQXvNPzRuwlr3.jpg)] flex items-center justify-center">


            <div className="min-h-screen w-full bg-black/50 flex items-center justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="bg-black p-8 mx-3 rounded-xl shadow-md border-2 border-gray-100/20 w-96 text-gray-100"
                >
                    <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-400 text-center mb-3">{error}</p>
                    )}



                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 mb-4 bg-gray-800 rounded-lg focus:outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 mb-6 bg-gray-800 rounded-lg focus:outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-sky-400 hover:bg-sky-900 py-3 rounded-lg font-medium cursor-pointer"
                    >
                        Register
                    </button>

                    <p className="text-center text-gray-400 mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-sky-600 hover:underline cursor-pointer">
                            Login
                        </Link>
                    </p>
                    <Link to={'/'}>
                        <h1 className="text-white text-center mt-5 cursor-pointer hover:underline">← Back</h1>
                    </Link>
                </form>
            </div>
        </div>
    );
}
