import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase"; // ملف إعداد الفايربيس

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const auth = getAuth(app);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/Authpage/login");
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    }
  };

  return (
    <div
      className="min-h-screen sm-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/99/4f/86/994f86cfa6466b8400b8593540b749d3.jpg')",
      }}
    >
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-0">
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md transform transition-all hover:scale-105">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
            Create Account
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
               
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 sm:py-3 bg-gray-100 bg-opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-gray-800 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
               
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 sm:py-3 bg-gray-100 bg-opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-black-800 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-200"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
          
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 sm:py-3 bg-gray-100 bg-opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-gray-800 text-sm sm:text-base"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 text-xs sm:text-sm text-gray-200"
              >
                Agree to terms and conditions
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 text-sm sm:text-base"
            >
              Register
            </button>
          </form>

          {/* مكان واضح لتسجيل الدخول */}
          <p className="mt-6 text-center text-sm text-gray-200">
            Already have an account?
          </p>
          <Link
            href="/Authpage/login"
            className="block mt-2 w-full text-center bg-gray-800 bg-opacity-60 text-white py-2 rounded-full hover:bg-gray-900 transition duration-300 text-sm sm:text-base"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
