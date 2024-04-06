import React from 'react'

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  setPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, pageCount, setPage }) => {
  if (pageCount <= 2) return null
  
  return (
    <div className="flex justify-center mt-4">
      <button onClick={() => setPage(1)} disabled={currentPage === 1} className="mr-2 px-4 py-2 bg-gray-200 text-black rounded">
        First
      </button>
      <button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="mr-2 px-4 py-2 bg-gray-200 text-black rounded">
        Previous
      </button>
      {Array.from({ length: pageCount }, (_, index) => (
        <button
          key={index}
          onClick={() => setPage(index + 1)}
          disabled={currentPage === index + 1}
          className={`mr-2 px-4 py-2 ${currentPage === index + 1
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-black'} rounded`}
        >
          {index + 1}
        </button>
      ))}
      <button onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount} className="mr-2 px-4 py-2 bg-gray-200 text-black rounded">
        Next
      </button>
      <button onClick={() => setPage(pageCount)} disabled={currentPage === pageCount} className="px-4 py-2 bg-gray-200 text-black rounded">
        Last
      </button>
    </div>
  )
}

export default Pagination
