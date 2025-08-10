"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/your-bg.jpg')" }}>
      {/* Navbar */}
      <nav className="bg-transparent fixed top-0 left-0 w-full z-50 text-white">
        <div className="flex justify-between items-center p-4">
          <div className="text-xl font-bold">LOGO</div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/services" className="hover:text-gray-300">Services</Link>
            <Link href="/price" className="hover:text-gray-300">Price</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
            <Link href="/blog" className="hover:text-gray-300">Blog</Link>
          </div>

          {/* Desktop Login */}
          <div className="hidden md:block">
            <Link href="/login">
              <button className="bg-black bg-opacity-50 text-white px-4 py-2 rounded hover:bg-opacity-70">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="flex flex-col items-start p-4 space-y-3 bg-black bg-opacity-50 md:hidden">
            <Link href="/" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/services" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/price" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Price</Link>
            <Link href="/contact" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link href="/blog" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Blog</Link>
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <button className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm w-full">
                Login
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* Login Form */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 md:p-8 max-w-xs md:max-w-md w-full mx-4 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4 text-white">Login</h2>

          <label className="block text-sm mb-1 text-white">Email ID</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 rounded-full bg-white bg-opacity-30 mb-3 placeholder-gray-200 text-white"
          />

          <label className="block text-sm mb-1 text-white">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 rounded-full bg-white bg-opacity-30 mb-3 placeholder-gray-200 text-white"
          />

          <div className="flex justify-between items-center text-sm mb-3 text-white">
            <label className="flex items-center space-x-1">
              <input type="checkbox" /> <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline">Forgot Password?</a>
          </div>

          <button className="bg-blue-600 text-white w-full py-2 rounded-full hover:bg-blue-700">
            Login
          </button>

          <p className="text-center text-sm mt-3 text-white">
            Don’t have an account? <a href="#" className="text-blue-300">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}
