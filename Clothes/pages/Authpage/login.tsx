import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase"; // ملف إعداد الفايربيس


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const auth = getAuth(app);

  // Clear fields on component mount
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ تسجيل الدخول ناجح");
      router.push("/"); // توجيه للصفحة الرئيسية
    } catch (err: any) {
      console.error("❌ خطأ:", err.message);
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      // Clear input fields on failed login
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div

      className="min-h-screen l-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.lovepik.com/bg/20231218/3D-Anime-Eye-Wallpaper-Stunning-Background-for-Your-Device_2609687_wh860.jpg!/fw/860')",
      }}
    >
  <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email ID
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 bg-gray-100 bg-opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-gray-800"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 bg-gray-100 bg-opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-gray-800"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-200">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-300 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-200">
            Don&apos;t have an account?{" "}
            <Link href="/Authpage/register" className="text-blue-300 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}