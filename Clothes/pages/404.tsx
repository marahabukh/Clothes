"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Head from "next/head"

export default function Custom404() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>404 - الصفحة غير موجودة</title>
        <meta name="description" content="عذراً، الصفحة التي تبحث عنها غير موجودة" />
      </Head>

      <div
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4"
        dir="rtl"
      >
        <div className="w-full max-w-md mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative mx-auto w-48 h-48 mb-8">
              <motion.div
                className="absolute inset-0 bg-gray-200 rounded-full opacity-20"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-[120px] font-bold text-gray-900 leading-none"
                >
                  404
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">الصفحة غير موجودة</h1>
            <p className="text-gray-600 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.</p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              onClick={() => router.push("/Home")}
              className="bg-black hover:bg-black/80 text-white w-full flex items-center justify-center gap-2 py-6"
              size="lg"
            >
              <Home className="h-5 w-5" />
              العودة إلى الصفحة الرئيسية
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                العودة للصفحة السابقة
              </Button>

              <Link href="/Home" className="flex-1">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" />
                  تصفح المنتجات
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p className="text-sm text-gray-500">إذا كنت تعتقد أن هناك خطأ، يرجى التواصل مع فريق الدعم الفني.</p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

