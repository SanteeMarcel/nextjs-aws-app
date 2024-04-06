import React from 'react'
import Image from 'next/image'

import { ImageData } from '../_interfaces/ImageData'

interface PaginationProps {
  currentImages: ImageData[];
  handleDelete: (id: string) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentImages, handleDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {currentImages.map((image) => (
        <div key={image.id} className="bg-white p-4 rounded shadow">
          <Image src={image.url} alt={image.name} width={200} height={200} />
          <h3 className="text-xl font-semibold mt-2">{image.name}</h3>
          <p className="text-gray-600">{image.description}</p>
          <button onClick={() => handleDelete(image.id)} className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default Pagination
