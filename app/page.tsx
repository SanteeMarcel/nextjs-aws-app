'use client'

import React, { useState, useEffect } from 'react'
import Pagination from './_components/Pagination'
import { useImageHandler } from './_hooks/useImageHandler'
import ImageUploadForm from './_components/ImageUploadForm'
import ImageList from './_components/ImageList'
import { ErrorData } from './_interfaces/ErrorData'
import ErrorPopup from './_components/Error'

const Home: React.FC = () => {
  const { images, handleUpload, handleDelete } = useImageHandler()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [imageDescription, setImageDescription] = useState('')
  const [error, setError] = useState<ErrorData>()

  const itemsPerPage = 20

  const handleDescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFiles) {
      handleUpload(selectedFiles, imageDescription)
        .then(e => setError(e))
      setSelectedFiles(null)
      setImageDescription('')
    }
  }

  const fetchImages = async () => {
    // Implement logic to fetch images from a server if required
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const pageCount = Math.ceil(images.length / itemsPerPage)

  const setPage = (page: number) => {
    setCurrentPage(page)
  }

  const indexOfLastImage = currentPage * itemsPerPage
  const indexOfFirstImage = indexOfLastImage - itemsPerPage
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage)

  return (
    <div className="container mx-auto px-4">
      <ErrorPopup error={error}/>
      <ImageUploadForm
        handleDescriptionSubmit={handleDescriptionSubmit}
        setSelectedFiles={setSelectedFiles}
        imageDescription={imageDescription}
        setImageDescription={setImageDescription}
      />
      <ImageList currentImages={currentImages} handleDelete={handleDelete} />
      <Pagination currentPage={currentPage} pageCount={pageCount} setPage={setPage} />
    </div>
  )
}

export default Home
