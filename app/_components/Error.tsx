import React, { useState } from 'react'

import { ErrorData } from '../_interfaces/ErrorData'

interface ErrorProps {
  error?: ErrorData;
}

const ErrorPopup: React.FC<ErrorProps> = ({ error }) => {
  const [isOpen, setIsOpen] = useState(true)

  if (!error || !isOpen) {
    return null
  }

  const { severity, message } = error
  const bgColor = severity === 'warning'
    ? 'bg-yellow-400'
    : 'bg-red-500'
  const closePopup = () => setIsOpen(false)

  return (
    <div className={'fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center'}>
      <div className={`p-4 max-w-sm mx-auto rounded shadow-lg text-white ${bgColor}`}>
        <div className="flex justify-between items-center">
          <div>{message}</div>
          <button onClick={closePopup} className="ml-4 rounded text-white focus:outline-none">
            <svg className="fill-current h-6 w-6" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1 1 0 0 1-1.414 0L10 11.414l-2.934 2.935a1 1 0 0 1-1.414-1.414l2.935-2.934-2.935-2.935a1 1 0 0 1 1.414-1.414L10 8.586l2.934-2.935a1 1 0 0 1 1.414 1.414L11.414 10l2.934 2.935a1 1 0 0 1 0 1.414z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPopup
