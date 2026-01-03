import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import swal from 'sweetalert';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [userLogin, setUserLogin] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            swal("Success!", "Login Successfull!", "success");
            setUserLogin(true)  
            setTimeout(() => {
                navigate("/dashboard"); // redirect after success
            }, 1000);
        } catch (err) {
            if (err.code === "auth/user-not-found") {
                setError("No account found with this email.");
            } else if (err.code === "auth/wrong-password") {
                setError("Incorrect password.");
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email format.");
            } else {
                setError("Failed to login. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[url(https://t4.ftcdn.net/jpg/02/00/68/69/360_F_200686969_GJ7zbz2qaNIE4dyHSbZkQXvNPzRuwlr3.jpg)] flex  items-center justify-center">


            <div className="min-h-screen w-full bg-black/50 flex  items-center justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="bg-black border-2 mx-3 border-gray-100/20 p-8 rounded-xl shadow-md w-96 text-gray-100"
                >
                    <h2 className="text-3xl font-bold text-center mb-6 ">Login</h2>

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
                        className="w-full bg-sky-400 hover:bg-sky-600 py-3 rounded-lg font-medium cursor-pointer"
                    >
                        Login
                    </button>

                    <p className="text-center text-gray-400 mt-4">
                        Don’t have an account?{" "}
                        <Link to="/register" className="text-sky-600 hover:underline cursor-pointer">
                            Register
                        </Link>
                    </p>
                    <Link to={'/'}>
                        <h1 className="text-white text-center mt-5 hover:underline">← Back</h1>
                    </Link>
                </form>
                
            </div>
            
        </div>

    );
}
