import React from 'react'
import Image from 'next/image'
import { GalleryImageData } from '../_interfaces/GalleryImageData'
import { handleDelete } from '../actions'

interface ImageListProps {
  currentImages: GalleryImageData[];
}

const ImageList: React.FC<ImageListProps> = ({ currentImages }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {currentImages.map((image) => (
        <div key={image.url} className="bg-white p-4 rounded shadow">
          <Image src={image.url} alt={'photo'} width={200} height={200} />
          <h3 className="text-xl font-semibold mt-2">${image.description}</h3>
          <p className="text-gray-600">${image.lastModified ? new Date(image.lastModified).toLocaleDateString() : null}</p>
          <button onClick={async () => handleDelete(image.url)} className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default ImageList
