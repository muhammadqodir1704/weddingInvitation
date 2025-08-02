"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMusic, setCurrentMusic] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement>(null)

  const playMusic = useCallback(
    (file: File) => {
      if (currentMusic) {
        URL.revokeObjectURL(currentMusic)
      }

      const url = URL.createObjectURL(file)
      setCurrentMusic(url)

      // Audio element yaratish
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.volume = volume
        audioRef.current.loop = true // Takrorlanish
        audioRef.current.play()
        setIsPlaying(true)
      }
    },
    [currentMusic, volume],
  )

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const removeMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }

    if (currentMusic) {
      URL.revokeObjectURL(currentMusic)
    }

    setCurrentMusic(null)
    setIsPlaying(false)
  }, [currentMusic])

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (currentMusic) {
        URL.revokeObjectURL(currentMusic)
      }
    }
  }, [currentMusic])

  return {
    isPlaying,
    currentMusic,
    volume,
    audioRef,
    playMusic,
    togglePlay,
    removeMusic,
    changeVolume,
    setIsPlaying,
  }
}
