import React from 'react'
import { uploadImages } from '../actions'

interface ImageUploadFormProps {
    imageDescription: string
    setImageDescription: (description: string) => void
} 

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ imageDescription, setImageDescription }) => {
  return (
    <form action={uploadImages} className="mb-4">
      <input
        id='file'
        name='file'
        type="file"
        multiple
        className="mb-2"
        accept='images/*'
      />
      <input
        type="text"
        placeholder="Enter image description"
        value={imageDescription}
        onChange={(e) => setImageDescription(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded-md text-black"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Upload
      </button>
    </form>
  )
}

export default ImageUploadForm
