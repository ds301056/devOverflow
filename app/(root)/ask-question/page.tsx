import Question from '@/components/forms/Question'
import React from 'react'

const Page = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark-100 dark:text-light-900">
        Ask a Question
      </h1>{' '}
      {/* Updated className */}
      <div>
        <Question />
      </div>
    </div>
  )
}

export default Page
