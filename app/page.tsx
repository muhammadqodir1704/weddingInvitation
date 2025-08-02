"use client"

import type React from "react"
import { Suspense } from "react"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Heart, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-400"></div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LargeAnimatedWeddingInvitation />
    </Suspense>
  )
}

function LargeAnimatedWeddingInvitation() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [audioFile, setAudioFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next")
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  // Default music file - add your music file to public folder and change this path
  const defaultMusicFile = "/wedding-music.mp3" // Change this to your music file name

  useEffect(() => {
    // Try to load default music file
    const audio = new Audio(defaultMusicFile)
    audio.addEventListener('canplaythrough', () => {
      setAudioFile(defaultMusicFile)
    })
    audio.addEventListener('error', () => {
      console.log('Default music file not found. Please add your music file to public folder.')
    })
  }, [])

  // Handle user interaction to enable autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted && audioRef.current && audioFile) {
        setHasUserInteracted(true)
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((error) => {
          console.log('Play failed:', error)
        })
      }
    }

    // Add event listeners for user interaction
    const events = ['click', 'touchstart', 'keydown', 'scroll']
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [hasUserInteracted, audioFile])

  useEffect(() => {
    // Auto-advance cards
    if (isAutoPlaying) {
      const timer = setInterval(() => {
        setSlideDirection("next")
        setCurrentCard((prev) => (prev + 1) % 3)
      }, 6000) // 6 seconds per card

      return () => clearInterval(timer)
    }
  }, [isAutoPlaying])

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else if (!audioFile) {
      fileInputRef.current?.click()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file)
      setAudioFile(url)

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load()
          audioRef.current.play()
          setIsPlaying(true)
        }
      }, 100)
    } else {
      alert("Iltimos, audio fayl tanlang (MP3, WAV, etc.)")
    }
  }

  const handleAudioEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  const goToCard = (index: number) => {
    const direction = index > currentCard ? "next" : "prev"
    setSlideDirection(direction)
    setCurrentCard(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 15 seconds
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const nextCard = () => {
    setSlideDirection("next")
    setCurrentCard((prev) => (prev + 1) % 3)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const prevCard = () => {
    setSlideDirection("prev")
    setCurrentCard((prev) => (prev - 1 + 3) % 3)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-rose-50 relative overflow-hidden flex items-start">
      {/* Enhanced floating particles animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          >
            <div
              className={`rounded-full opacity-60 ${
                i % 4 === 0
                  ? "w-3 h-3 bg-pink-300"
                  : i % 4 === 1
                    ? "w-2 h-2 bg-purple-300"
                    : i % 4 === 2
                      ? "w-4 h-4 bg-rose-300"
                      : "w-2 h-2 bg-yellow-300"
              }`}
            ></div>
          </div>
        ))}
      </div>

      {/* Top Controls */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-between items-center px-6">
        {/* Music control */}
        <Button
          onClick={toggleMusic}
          className="bg-rose-400 hover:bg-rose-500 text-white rounded-full p-4 shadow-xl animate-bounce-slow"
          size="lg"
        >
          {isPlaying ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          {!audioFile && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></span>
          )}
        </Button>

        {/* Card navigation dots */}
        <div className="flex space-x-4">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`transition-all duration-500 rounded-full ${
                currentCard === index
                  ? "w-12 h-4 bg-rose-400 shadow-lg"
                  : "w-4 h-4 bg-white/60 hover:bg-white/90 hover:scale-125"
              }`}
            />
          ))}
        </div>

        {/* Auto-play control */}
        <Button
          onClick={toggleAutoPlay}
          className="bg-purple-400 hover:bg-purple-500 text-white rounded-full p-4 shadow-xl"
          size="lg"
        >
          {isAutoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
      </div>

      {/* Side Navigation */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-4">
        <Button
          onClick={prevCard}
          className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-rose-400 rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>

      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-4">
        <Button
          onClick={nextCard}
          className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-rose-400 rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-300"
          style={{ width: `${((currentCard + 1) / 3) * 100}%` }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10 flex items-start justify-center h-full pt-20">
        <div className="relative w-full max-w-sm md:max-w-2xl">
          {" "}
          {/* Increased from max-w-md to max-w-2xl */}
          {/* Card 1 - Main Invitation */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              currentCard === 0
                ? "opacity-100 translate-x-0 scale-100 rotate-0 z-30"
                : slideDirection === "next"
                  ? "opacity-0 -translate-x-full scale-90 -rotate-6 z-10"
                  : "opacity-0 translate-x-full scale-90 rotate-6 z-10"
            }`}
          >
            <Card className="bg-white shadow-2xl border-0 overflow-hidden relative animate-card-entrance transform hover:scale-105 transition-transform duration-500">
              {/* Enhanced animated floral decorations */}
              <div className="absolute top-0 left-0 w-full h-40 overflow-hidden">
                {" "}
                {/* Increased height */}
                <div className="absolute top-0 left-0 w-60 h-40 animate-slide-in-left">
                  {" "}
                  {/* Increased size */}
                  <svg viewBox="0 0 240 160" className="w-full h-full">
                    {" "}
                    {/* Adjusted viewBox */}
                    <circle cx="50" cy="40" r="18" fill="#f8a5c2" opacity="0.8" className="animate-pulse-slow" />
                    <circle cx="45" cy="35" r="12" fill="#f472b6" className="animate-pulse-slow" />
                    <circle cx="75" cy="60" r="15" fill="#ec4899" opacity="0.7" className="animate-pulse-slow" />
                    <circle cx="100" cy="35" r="14" fill="#f8a5c2" className="animate-pulse-slow" />
                    <circle cx="130" cy="50" r="16" fill="#f472b6" opacity="0.8" className="animate-pulse-slow" />
                    <ellipse
                      cx="30"
                      cy="55"
                      rx="12"
                      ry="22"
                      fill="#e879f9"
                      opacity="0.6"
                      transform="rotate(45 30 55)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="85"
                      cy="45"
                      rx="10"
                      ry="18"
                      fill="#d946ef"
                      opacity="0.5"
                      transform="rotate(-30 85 45)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="115"
                      cy="65"
                      rx="11"
                      ry="20"
                      fill="#e879f9"
                      opacity="0.6"
                      transform="rotate(60 115 65)"
                      className="animate-sway"
                    />
                    <circle cx="70" cy="25" r="8" fill="#fbbf24" opacity="0.8" className="animate-twinkle" />
                    <circle cx="95" cy="70" r="9" fill="#f8a5c2" opacity="0.6" className="animate-twinkle" />
                    <circle cx="140" cy="30" r="7" fill="#fbbf24" opacity="0.9" className="animate-twinkle" />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-60 h-40 transform scale-x-[-1] animate-slide-in-right">
                  <svg viewBox="0 0 240 160" className="w-full h-full">
                    <circle cx="50" cy="40" r="18" fill="#f8a5c2" opacity="0.8" className="animate-pulse-slow" />
                    <circle cx="45" cy="35" r="12" fill="#f472b6" className="animate-pulse-slow" />
                    <circle cx="75" cy="60" r="15" fill="#ec4899" opacity="0.7" className="animate-pulse-slow" />
                    <circle cx="100" cy="35" r="14" fill="#f8a5c2" className="animate-pulse-slow" />
                    <circle cx="130" cy="50" r="16" fill="#f472b6" opacity="0.8" className="animate-pulse-slow" />

                    <ellipse
                      cx="30"
                      cy="55"
                      rx="12"
                      ry="22"
                      fill="#e879f9"
                      opacity="0.6"
                      transform="rotate(45 30 55)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="85"
                      cy="45"
                      rx="10"
                      ry="18"
                      fill="#d946ef"
                      opacity="0.5"
                      transform="rotate(-30 85 45)"
                      className="animate-sway"
                    />

                    <circle cx="70" cy="25" r="8" fill="#fbbf24" opacity="0.8" className="animate-twinkle" />
                    <circle cx="95" cy="70" r="9" fill="#f8a5c2" opacity="0.6" className="animate-twinkle" />
                  </svg>
                </div>
              </div>

              {/* Bottom floral decoration */}
              <div className="absolute bottom-0 left-0 w-full h-40 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-60 h-40 transform rotate-180 animate-slide-in-up">
                  <svg viewBox="0 0 240 160" className="w-full h-full">
                    <circle cx="50" cy="40" r="18" fill="#f8a5c2" opacity="0.8" className="animate-pulse-slow" />
                    <circle cx="45" cy="35" r="12" fill="#f472b6" className="animate-pulse-slow" />
                    <circle cx="75" cy="60" r="15" fill="#ec4899" opacity="0.7" className="animate-pulse-slow" />
                    <circle cx="100" cy="35" r="14" fill="#f8a5c2" className="animate-pulse-slow" />

                    <ellipse
                      cx="30"
                      cy="55"
                      rx="12"
                      ry="22"
                      fill="#e879f9"
                      opacity="0.6"
                      transform="rotate(45 30 55)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="85"
                      cy="45"
                      rx="10"
                      ry="18"
                      fill="#d946ef"
                      opacity="0.5"
                      transform="rotate(-30 85 45)"
                      className="animate-sway"
                    />

                    <circle cx="70" cy="25" r="8" fill="#fbbf24" opacity="0.8" className="animate-twinkle" />
                    <circle cx="95" cy="70" r="9" fill="#f8a5c2" opacity="0.6" className="animate-twinkle" />
                  </svg>
                </div>

                <div className="absolute bottom-0 right-0 w-60 h-40 transform rotate-180 scale-x-[-1] animate-slide-in-up">
                  <svg viewBox="0 0 240 160" className="w-full h-full">
                    <circle cx="50" cy="40" r="18" fill="#f8a5c2" opacity="0.8" className="animate-pulse-slow" />
                    <circle cx="45" cy="35" r="12" fill="#f472b6" className="animate-pulse-slow" />
                    <circle cx="75" cy="60" r="15" fill="#ec4899" opacity="0.7" className="animate-pulse-slow" />

                    <ellipse
                      cx="30"
                      cy="55"
                      rx="12"
                      ry="22"
                      fill="#e879f9"
                      opacity="0.6"
                      transform="rotate(45 30 55)"
                      className="animate-sway"
                    />

                    <circle cx="70" cy="25" r="8" fill="#fbbf24" className="animate-pulse-slow" />
                  </svg>
                </div>
              </div>

              <CardContent className="p-4 md:p-8 relative z-10">
                {" "}
                {/* Increased padding */}
                <div className="text-center mb-6 md:mb-8 mt-6 md:mt-8">
                  {" "}
                  {/* Increased margins */}
                  <p className="text-sm md:text-lg text-gray-600 tracking-widest mb-6 font-light animate-fade-in-up">
                    {" "}
                    {/* Increased text size */}
                    WEDDING DAY
                  </p>
                  <div className="mb-8 md:mb-12">
                    {" "}
                    {/* Increased margin */}
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 font-serif tracking-wide animate-slide-in-left animation-delay-300">
                      {" "}
                      {/* Increased text size */}
                      JALOLIDDIN
                    </h1>
                    <div className="flex items-center justify-center mb-4 animate-scale-in animation-delay-600">
                      <div className="w-8 md:w-12 h-px bg-rose-400"></div> {/* Increased width */}
                      <span className="text-2xl md:text-4xl text-rose-400 mx-2 md:mx-4">&</span> {/* Increased text size and margin */}
                      <div className="w-8 md:w-12 h-px bg-rose-400"></div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 font-serif tracking-wide animate-slide-in-right animation-delay-900">
                      SEVINCH
                    </h1>
                  </div>
                  <div className="flex justify-center mb-8 animate-fade-in-up animation-delay-1200">
                    <svg width="160" height="30" viewBox="0 0 160 30">
                      {" "}
                      {/* Increased size */}
                      <path
                        d="M15 15 Q40 8 65 15 T115 15 Q130 12 145 15"
                        stroke="#f472b6"
                        strokeWidth="2"
                        fill="none"
                        className="animate-draw-line"
                      />
                      <circle cx="80" cy="15" r="5" fill="#fbbf24" className="animate-pulse-slow" />{" "}
                      {/* Increased radius */}
                      <circle cx="55" cy="12" r="3" fill="#f472b6" className="animate-pulse-slow" />
                      <circle cx="105" cy="12" r="3" fill="#f472b6" className="animate-pulse-slow" />
                    </svg>
                  </div>
                  <div className="mb-8 md:mb-10 animate-fade-in-up animation-delay-1500">
                    {" "}
                    {/* Increased margin */}
                    <p className="text-lg md:text-2xl text-gray-700 font-medium mb-2">Yakshanba</p> {/* Increased text size */}
                    <p className="text-2xl md:text-4xl font-bold text-gray-800 my-4">03.09.2025</p> {/* Increased text size */}
                    <p className="text-lg md:text-2xl text-gray-700 font-medium">19:00</p>
                  </div>
                  <div className="mb-8 md:mb-12 animate-fade-in-up animation-delay-1800">
                    {" "}
                    {/* Increased margin */}
                    <p className="text-gray-600 text-sm md:text-base mb-3">Sherobod tumani</p> {/* Increased text size */}
                    <p className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">&ldquo;Al Amin&rdquo; to&apos;yxonasi</p>{" "}
                    {/* Increased text size */}
                    <p className="text-gray-600 text-sm md:text-base mt-3">Eshboy Avazovlar xonadoni</p>
                  </div>
                  <div className="flex justify-center animate-fade-in-up animation-delay-2100">
                    <svg width="140" height="25" viewBox="0 0 140 25">
                      {" "}
                      {/* Increased size */}
                      <path
                        d="M10 12 Q35 6 60 12 T110 12 Q120 9 130 12"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        fill="none"
                        className="animate-draw-line"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Card 2 - Invitation Message */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              currentCard === 1
                ? "opacity-100 translate-x-0 scale-100 rotate-0 z-30"
                : slideDirection === "next"
                  ? currentCard === 0
                    ? "opacity-0 translate-x-full scale-90 rotate-6 z-10"
                    : "opacity-0 -translate-x-full scale-90 -rotate-6 z-10"
                  : currentCard === 2
                    ? "opacity-0 translate-x-full scale-90 rotate-6 z-10"
                    : "opacity-0 -translate-x-full scale-90 -rotate-6 z-10"
            }`}
          >
            <Card className="bg-white shadow-2xl border-0 overflow-hidden relative animate-card-entrance transform hover:scale-105 transition-transform duration-500">
              {/* Enhanced animated floral border */}
              <div className="absolute inset-0">
                <svg viewBox="0 0 400 700" className="w-full h-full">
                  {" "}
                  {/* Increased viewBox */}
                  <g className="animate-fade-in-up">
                    <circle cx="70" cy="60" r="20" fill="#f8a5c2" opacity="0.7" className="animate-pulse-slow" />{" "}
                    {/* Increased sizes */}
                    <circle cx="65" cy="55" r="14" fill="#f472b6" className="animate-pulse-slow" />
                    <circle cx="110" cy="80" r="16" fill="#ec4899" opacity="0.6" className="animate-pulse-slow" />
                    <circle cx="160" cy="50" r="15" fill="#f8a5c2" className="animate-pulse-slow" />
                    <circle cx="330" cy="60" r="20" fill="#f8a5c2" opacity="0.7" className="animate-pulse-slow" />
                    <circle cx="335" cy="55" r="14" fill="#f472b6" className="animate-pulse-slow" />
                    <circle cx="290" cy="80" r="16" fill="#ec4899" opacity="0.6" className="animate-pulse-slow" />
                    <circle cx="240" cy="50" r="15" fill="#f8a5c2" className="animate-pulse-slow" />
                    <ellipse
                      cx="50"
                      cy="85"
                      rx="12"
                      ry="25"
                      fill="#8b5cf6"
                      opacity="0.5"
                      transform="rotate(45 50 85)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="140"
                      cy="70"
                      rx="10"
                      ry="20"
                      fill="#6366f1"
                      opacity="0.4"
                      transform="rotate(-30 140 70)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="350"
                      cy="85"
                      rx="12"
                      ry="25"
                      fill="#8b5cf6"
                      opacity="0.5"
                      transform="rotate(-45 350 85)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="260"
                      cy="70"
                      rx="10"
                      ry="20"
                      fill="#6366f1"
                      opacity="0.4"
                      transform="rotate(30 260 70)"
                      className="animate-sway"
                    />
                  </g>
                  <g className="animate-fade-in-up animation-delay-500">
                    <circle cx="70" cy="640" r="20" fill="#f8a5c2" opacity="0.7" className="animate-pulse-slow" />
                    <circle cx="65" cy="645" r="14" fill="#f472b6" className="animate-pulse-slow" />
                    <circle cx="110" cy="620" r="16" fill="#ec4899" opacity="0.6" className="animate-pulse-slow" />
                    <circle cx="160" cy="650" r="15" fill="#f8a5c2" className="animate-pulse-slow" />
                    <circle cx="330" cy="640" r="20" fill="#f8a5c2" opacity="0.7" className="animate-pulse-slow" />
                    <circle cx="335" cy="645" r="14" fill="#f472b6" className="animate-pulse-slow" />
                    <circle cx="290" cy="620" r="16" fill="#ec4899" opacity="0.6" className="animate-pulse-slow" />
                    <circle cx="240" cy="650" r="15" fill="#f8a5c2" className="animate-pulse-slow" />

                    <ellipse
                      cx="50"
                      cy="615"
                      rx="12"
                      ry="25"
                      fill="#8b5cf6"
                      opacity="0.5"
                      transform="rotate(-45 50 615)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="140"
                      cy="630"
                      rx="10"
                      ry="20"
                      fill="#6366f1"
                      opacity="0.4"
                      transform="rotate(30 140 630)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="350"
                      cy="615"
                      rx="12"
                      ry="25"
                      fill="#8b5cf6"
                      opacity="0.5"
                      transform="rotate(45 350 615)"
                      className="animate-sway"
                    />
                    <ellipse
                      cx="260"
                      cy="630"
                      rx="10"
                      ry="20"
                      fill="#6366f1"
                      opacity="0.4"
                      transform="rotate(-30 260 630)"
                      className="animate-sway"
                    />
                  </g>
                </svg>
              </div>

              <CardContent className="p-4 md:p-8 relative z-10">
                {" "}
                {/* Increased padding */}
                <div className="text-center py-8 md:py-12">
                  {" "}
                  {/* Increased padding */}
                  <div className="bg-gradient-to-r from-pink-200 to-rose-200 py-4 md:py-6 px-6 md:px-12 rounded-lg mb-8 md:mb-12 relative animate-scale-in">
                    {" "}
                    {/* Increased padding and margin */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-rose-300/20 rounded-lg"></div>
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 relative z-10 mb-2">SIZNI KUTIB</h2>{" "}
                    {/* Increased text size */}
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 relative z-10">QOLAMIZ!</h2>
                  </div>
                  <div className="space-y-4 md:space-y-6 text-gray-700 leading-relaxed animate-fade-in-up animation-delay-500">
                    {" "}
                    {/* Increased spacing */}
                    <p className="text-base md:text-lg italic">&ldquo;Alloh ularning qalblarini sevgi ila birlashtirdi&rdquo;</p>{" "}
                    {/* Increased text size */}
                    <p className="text-sm md:text-base text-gray-500">Anfol surasi 63-oyat</p> {/* Increased text size */}
                    <div className="my-6 md:my-10">
                      {" "}
                      {/* Increased margin */}
                      <div className="w-16 md:w-24 h-px bg-rose-300 mx-auto animate-expand-width"></div> {/* Increased width */}
                    </div>
                    <p className="text-base md:text-xl animate-fade-in-up animation-delay-1000 leading-relaxed">
                      {" "}
                      {/* Increased text size */}
                      Sizni hayotimizdagi eng baxtiyar kun nikoh to&apos;yiga bag&apos;ishlangan tantanali kechaning aziz
                      mehmonimiz bo&apos;lishga taklif qilamiz!
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4 mt-8 md:mt-12 animate-fade-in-up animation-delay-1500">
                    {" "}
                    {/* Increased spacing and margin */}
                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-rose-400 fill-current animate-pulse" /> {/* Increased size */}
                    <Heart
                      className="w-8 h-8 md:w-10 md:h-10 text-pink-400 fill-current animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <Heart
                      className="w-8 h-8 md:w-10 md:h-10 text-rose-400 fill-current animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Card 3 - Monogram */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              currentCard === 2
                ? "opacity-100 translate-x-0 scale-100 rotate-0 z-30"
                : slideDirection === "next"
                  ? "opacity-0 translate-x-full scale-90 rotate-6 z-10"
                  : "opacity-0 -translate-x-full scale-90 -rotate-6 z-10"
            }`}
          >
            <Card className="bg-white shadow-2xl border-0 overflow-hidden relative animate-card-entrance transform hover:scale-105 transition-transform duration-500">
              <CardContent className="p-4 md:p-8 relative z-10">
                {" "}
                {/* Increased padding */}
                <div className="text-center py-8 md:py-12">
                  {" "}
                  {/* Increased padding */}
                  <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64 mb-8 md:mb-12 animate-scale-in">
                    {" "}
                    {/* Increased size and margin */}
                    <svg viewBox="0 0 260 260" className="w-full h-full absolute inset-0">
                      {" "}
                      {/* Adjusted viewBox */}
                      <polygon
                        points="130,25 220,75 220,185 130,235 40,185 40,75"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="4" // Increased stroke width
                        className="animate-draw-polygon"
                      />
                      <polygon
                        points="130,40 200,85 200,175 130,220 60,175 60,85"
                        fill="none"
                        stroke="#f472b6"
                        strokeWidth="3" // Increased stroke width
                        opacity="0.6"
                        className="animate-draw-polygon animation-delay-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up animation-delay-1000">
                      <div className="text-6xl md:text-8xl font-bold text-rose-500">
                        {" "}
                        {/* Increased text size */}
                        <span className="font-serif animate-bounce-in">J</span>
                        <span className="font-serif animate-bounce-in animation-delay-300">S</span>
                      </div>
                    </div>
                    {/* Enhanced animated floral decorations around hexagon */}
                    <div className="absolute -top-6 -left-6 animate-float animation-delay-1500">
                      {" "}
                      {/* Increased positioning */}
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        {" "}
                        {/* Increased size */}
                        <circle cx="30" cy="30" r="12" fill="#f8a5c2" opacity="0.8" className="animate-pulse-slow" />
                        <circle cx="22" cy="22" r="8" fill="#f472b6" className="animate-pulse-slow" />
                      </svg>
                    </div>
                    <div className="absolute -top-6 -right-6 animate-float animation-delay-1800">
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="12" fill="#f8a5c2" opacity="0.8" className="animate-pulse-slow" />
                        <circle cx="38" cy="22" r="8" fill="#f472b6" className="animate-pulse-slow" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-6 -left-6 animate-float animation-delay-2100">
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="12" fill="#f8a5c2" opacity="0.8" className="animate-pulse-slow" />
                        <circle cx="22" cy="38" r="8" fill="#f472b6" className="animate-pulse-slow" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-6 -right-6 animate-float animation-delay-2400">
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="12" fill="#f8a5c2" opacity="0.8" className="animate-pulse-slow" />
                        <circle cx="38" cy="38" r="8" fill="#f472b6" className="animate-pulse-slow" />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-pink-100 to-rose-100 py-3 md:py-4 px-6 md:px-10 rounded-full animate-fade-in-up animation-delay-2700">
                    {" "}
                    {/* Increased padding */}
                    <p className="text-lg md:text-xl text-gray-700 font-medium">03 • 09 • 2025</p> {/* Increased text size */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />

      {/* Audio element */}
      {audioFile && (
        <audio
          ref={audioRef}
          src={audioFile}
          onEnded={handleAudioEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="auto"
          loop
        />
      )}
    </div>
  )
}
