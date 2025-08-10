"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface MaintenancePageProps {
  maintenanceType: "maintenance" | "comingSoon"
}

export default function MaintenancePage({ maintenanceType }: MaintenancePageProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const isComingSoon = maintenanceType === "comingSoon"

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden px-4" dir="rtl">
      {/* Bubbles background */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100 rounded-full opacity-10 animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-blue-200 rounded-full opacity-10 animate-float-delay" />
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-blue-100 rounded-full opacity-10 animate-float" />

      {/* Logo */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-extrabold text-black tracking-wide">GLOSSYCARE</h1>
        <div className="mt-2 space-y-1 text-gray-700 text-sm">
          <p className="text-lg font-medium">Scientific Care <span className="italic">With</span> Complete Care</p>
          <p className="text-base text-gray-500">عناية علمية مُتكاملة</p>
        </div>
      </motion.div>

      {/* Content Section */}
      {isComingSoon ? (
        <>
          {/* Coming Soon Title */}
          <motion.h2
            className="mt-16 text-3xl font-bold text-black z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            جمالك تحت التحضير
          </motion.h2>

          {/* Launch Line */}
          <motion.div
            className="mt-6 z-10 text-gray-600 font-medium text-base flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.span
              className="text-sm animate-spin"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              ⏳
            </motion.span>
            <span className="text-lg font-semibold">الانطلاق الرسمي صيف 2025</span>
          </motion.div>
        </>
      ) : (
        <>
          {/* Maintenance Title */}
          <motion.h2
            className="mt-16 text-3xl font-bold text-blue-900 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            الموقع تحت الصيانة
          </motion.h2>

          {/* Maintenance Message */}
          <motion.p
            className="mt-4 text-gray-600 text-lg text-center max-w-xl z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            نعتذر عن الإزعاج، الموقع قيد الصيانة حالياً. سنعود قريباً!
          </motion.p>
        </>
      )}

      {/* Loading dots or spin */}
      <motion.p
        className="mt-8 text-gray-400 text-lg h-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        {dots}
      </motion.p>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes float-delay {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 7s ease-in-out infinite;
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-spin {
          display: inline-block;
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
