"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  acceptedFileTypes: string
  maxSizeMB: number
}

export function FileUpload({ onFileChange, acceptedFileTypes, maxSizeMB }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (!selectedFile) {
      setFile(null)
      onFileChange(null)
      return
    }

    // Check file type
    const fileType = selectedFile.type
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase()
    const isAcceptedType = acceptedFileTypes
      .split(",")
      .some((type) => type.includes(fileType) || type.includes(`.${fileExtension}`))

    if (!isAcceptedType) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes} files.`)
      setFile(null)
      onFileChange(null)
      return
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (selectedFile.size > maxSizeBytes) {
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB.`)
      setFile(null)
      onFileChange(null)
      return
    }

    setError(null)
    setFile(selectedFile)
    onFileChange(selectedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mb-4">
            {acceptedFileTypes.replace(/\./g, "").toUpperCase()} (Max {maxSizeMB}MB)
          </p>
          <Button variant="outline" size="sm" type="button">
            Select File
          </Button>
          <input
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium line-clamp-1">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

