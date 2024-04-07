'use client'

import React, { useState, useEffect } from 'react'
import Pagination from './_components/Pagination'
import ImageUploadForm from './_components/ImageUploadForm'
import ImageList from './_components/ImageList'
import { ErrorData } from './_interfaces/ErrorData'
import ErrorPopup from './_components/Error'
import { fetchImages } from '@/app/actions'
import { GalleryImageData } from './_interfaces/GalleryImageData'

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [imageDescription, setImageDescription] = useState('')
  const [error, setError] = useState<ErrorData>()
  const [images, setImages] = useState<GalleryImageData[]>([])

  const itemsPerPage = 20

  useEffect(() => {
    async function fetchData() {
      const response = await fetchImages()
      if (response.severity) setError(response)
      if (response.images?.length) setImages(response.images)
    }
    fetchData()
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
        imageDescription={imageDescription}
        setImageDescription={setImageDescription}
      />
      <ImageList currentImages={currentImages} />
      <Pagination currentPage={currentPage} pageCount={pageCount} setPage={setPage} />
    </div>
  )
}

export default Home
