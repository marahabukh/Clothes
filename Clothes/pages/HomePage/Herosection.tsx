"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Spinner } from "@nextui-org/react"

// Add global styles to hide video controls
const videoStyles = `
  video::-webkit-media-controls {
    display: none !important;
  }
  video::-webkit-media-controls-enclosure {
    display: none !important;
  }
  video::-webkit-media-controls-panel {
    display: none !important;
  }
  video::-webkit-media-controls-play-button {
    display: none !important;
  }
  video::-webkit-media-controls-start-playback-button {
    display: none !important;
  }
`

interface HeroItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  order: number
  active: boolean
  createdAt?: any
  updatedAt?: any
}

export default function HeroSection() {
  const [heroItems, setHeroItems] = useState<HeroItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    fetchHeroItems()
  }, [])

  useEffect(() => {
    if (autoplay && heroItems.length > 0) {
      startAutoplay()
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [autoplay, heroItems, currentIndex])

  // When current item changes to a video, ensure it plays
  useEffect(() => {
    if (heroItems.length > 0 && heroItems[currentIndex]?.type === "video" && videoRef.current) {
      videoRef.current.play().catch((err) => console.error("Video play error:", err))
    }
  }, [currentIndex, heroItems])

  const fetchHeroItems = async () => {
    try {
      setLoading(true)
      const heroItemsRef = collection(db, "heroContent")
      const q = query(heroItemsRef, where("active", "==", true), orderBy("order", "asc"))

      const querySnapshot = await getDocs(q)
      const heroItemsData: HeroItem[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<HeroItem, "id">),
      }))

      setHeroItems(heroItemsData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching hero items:", error)
      setLoading(false)
    }
  }

  const startAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }

    // Set a longer interval for both images and videos
    const interval = 8000

    autoplayRef.current = setInterval(() => {
      goToNext()
    }, interval)
  }

  const goToNext = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }
    setCurrentIndex((prevIndex) => (prevIndex === heroItems.length - 1 ? 0 : prevIndex + 1))
  }

  const handleMouseEnter = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }
    setAutoplay(false)
  }

  const handleMouseLeave = () => {
    setAutoplay(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-black">
        <Spinner color="white" size="lg" />
      </div>
    )
  }

  if (heroItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <h2 className="text-2xl">No hero content available</h2>
      </div>
    )
  }

  const currentItem = heroItems[currentIndex]

  return (
   <div
  className="relative w-full h-[40vh] lg:h-[70vh] overflow-hidden bg-black"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>

      <style jsx global>
        {videoStyles}
      </style>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {currentItem.type === "image" ? (
            <motion.div
              className="relative w-full h-full"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
            >
              <img
                src={currentItem.url || "/placeholder.svg"}
                alt={currentItem.title}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: "center",
                }}
                loading="eager"
                onLoad={(e) => {
                  // Force browser to render at highest quality
                  const img = e.currentTarget
                  if (img.naturalWidth && img.naturalHeight) {
                    // Ensure image is displayed at optimal resolution
                    img.style.width = "100%"
                    img.style.height = "100%"
                  }
                }}
              />
            </motion.div>
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={currentItem.url}
                autoPlay
                muted
                playsInline
                loop
                className="w-full h-full object-cover"
                style={{
                  objectPosition: "center",
                }}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture={true}
                disableRemotePlayback={true}
                onLoadedData={() => {
                  // Ensure video plays when it becomes the current item
                  if (videoRef.current) {
                    videoRef.current.play().catch((err) => console.error("Video play error:", err))
                  }
                }}
              />
            </div>
          )}

          {/* Content overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 md:p-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {currentItem.title}
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              {currentItem.description}
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
