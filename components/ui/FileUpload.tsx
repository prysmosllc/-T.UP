'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<string>
  onFileRemove: () => void
  currentFileUrl?: string
  currentFileName?: string
  accept?: Record<string, string[]>
  maxSize?: number
  disabled?: boolean
  label?: string
  description?: string
}

export function FileUpload({
  onFileUpload,
  onFileRemove,
  currentFileUrl,
  currentFileName,
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  label = 'Upload Pitch Deck',
  description = 'Upload your pitch deck (PDF, PPT, or PPTX, max 10MB)'
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsUploading(true)
    setUploadError(null)

    try {
      await onFileUpload(file)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled: disabled || isUploading
  })

  const handleRemove = () => {
    setUploadError(null)
    onFileRemove()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
          {label} <span className="text-medium-grey font-normal">(Optional)</span>
        </label>
        <p className="text-sm text-dark-grey font-inter mb-3">{description}</p>
      </div>

      {currentFileUrl ? (
        // File uploaded state
        <div className="bg-white/50 backdrop-blur-sm border border-medium-grey/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-inter font-medium text-stellar">
                  {currentFileName || 'Pitch Deck'}
                </p>
                <p className="text-sm text-dark-grey font-inter">
                  File uploaded successfully
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={currentFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-dark-grey hover:text-teal transition-colors duration-200"
                title="View file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </a>
              <button
                onClick={handleRemove}
                className="p-2 text-dark-grey hover:text-red-500 transition-colors duration-200"
                title="Remove file"
                disabled={disabled}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Upload area
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-teal bg-teal/5'
              : 'border-medium-grey/30 hover:border-teal/50 bg-white/50 backdrop-blur-sm'
          } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-teal/30 border-t-teal rounded-full animate-spin"></div>
              ) : (
                <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            
            <div>
              <p className="text-lg font-inter font-medium text-stellar mb-2">
                {isUploading ? 'Uploading...' : isDragActive ? 'Drop your file here' : 'Drag & drop your pitch deck'}
              </p>
              <p className="text-sm text-dark-grey font-inter">
                or <span className="text-teal font-medium">browse files</span>
              </p>
            </div>
            
            <div className="text-xs text-medium-grey font-inter">
              Supports PDF, PPT, PPTX • Max {formatFileSize(maxSize)}
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 font-inter">{uploadError}</p>
          </div>
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="space-y-2">
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name}>
                <p className="text-sm font-medium text-red-700 font-inter">{file.name}</p>
                {errors.map((error) => (
                  <p key={error.code} className="text-xs text-red-600 font-inter">
                    {error.code === 'file-too-large' 
                      ? `File is too large. Max size is ${formatFileSize(maxSize)}`
                      : error.code === 'file-invalid-type'
                      ? 'Invalid file type. Please upload PDF, PPT, or PPTX files only'
                      : error.message
                    }
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}