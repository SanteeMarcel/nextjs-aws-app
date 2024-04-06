import { useState } from 'react'
import { ImageData } from '../_interfaces/ImageData'

export const useImageHandler = (initialState: ImageData[] = []) => {
  const [images, setImages] = useState(initialState)

  const handleUpload = async (files: FileList, description: string) => {
    const uploadedImages = Array.from(files).filter(file => 
      file.type === 'image/png' || file.type === 'image/jpeg'
    ).map((file) => ({
      id: file.name,
      name: file.name,
      description: description,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
    }))

    if (uploadedImages.length == 0) {
      return { severity: 'error', message: 'Only png and jpeg files are allowed.' }
    }

    setImages((prevImages) => [...prevImages, ...uploadedImages])

    const invalidFilesCounter = files.length - uploadedImages.length

    if (invalidFilesCounter > 0) {
      return { severity: 'warning', message: `Only png and jpeg files are allowed. ${invalidFilesCounter} file${invalidFilesCounter === 1
        ? ' was'
        : 's were'} suppressed.` }
    }
  }

  const handleDelete = (imageId: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== imageId))
  }

  return { images, handleUpload, handleDelete }
}
