"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Music, X, Play, Pause } from "lucide-react"

interface MusicUploadProps {
  onMusicSelect: (file: File) => void
  isPlaying: boolean
  onTogglePlay: () => void
  currentMusic: string | null
  onRemoveMusic: () => void
}

export default function MusicUpload({
  onMusicSelect,
  isPlaying,
  onTogglePlay,
  currentMusic,
  onRemoveMusic,
}: MusicUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("audio/")) {
      onMusicSelect(file)
    } else {
      alert("Iltimos, audio fayl tanlang!")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  if (currentMusic) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Music className="w-5 h-5 text-gold-400" />
              <span className="text-white text-sm">Musiqa yuklandi</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={onTogglePlay} size="sm" className="bg-gold-400/20 hover:bg-gold-400/30 text-white">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button onClick={onRemoveMusic} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`bg-white/5 backdrop-blur-md border-2 border-dashed transition-all duration-300 ${
        dragOver ? "border-gold-400 bg-gold-400/10" : "border-white/20"
      }`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gold-400/20 rounded-full">
              <Upload className="w-8 h-8 text-gold-400" />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Sevimli musiqangizni yuklang</h3>
            <p className="text-white/60 text-sm mb-4">MP3, WAV, AAC formatlarini qo&apos;llab-quvvatlaydi</p>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gold-400 hover:bg-gold-500 text-black font-medium"
          >
            <Music className="w-4 h-4 mr-2" />
            Fayl tanlash
          </Button>

          <p className="text-white/40 text-xs">Yoki faylni bu yerga sudrab tashlang</p>
        </div>

        <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileInput} className="hidden" />
      </CardContent>
    </Card>
  )
}
