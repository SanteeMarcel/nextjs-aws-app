import React from 'react'

interface ImageUploadFormProps {
    handleDescriptionSubmit: (e: React.FormEvent) => void;
    setSelectedFiles: (fileList: FileList | null) => void;
    imageDescription: string
    setImageDescription: (description: string) => void
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ handleDescriptionSubmit, setSelectedFiles, imageDescription, setImageDescription }) => {
  return (
    <form onSubmit={handleDescriptionSubmit} className="mb-4">
      <input
        type="file"
        multiple
        onChange={(e) => setSelectedFiles(e.target.files)}
        className="mb-2"
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
