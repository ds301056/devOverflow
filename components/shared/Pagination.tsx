'use client' // use client

import { useRouter, useSearchParams } from 'next/navigation'
// Importing modules
import { Button } from '../ui/button'
import { formUrlQuery } from '@/lib/utils'

// define interface for props
interface Props {
  pageNumber: number
  isNext: boolean
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter() // get router
  const searchParams = useSearchParams() // get search params

  // handle navigation
  const handleNavigation = (direction: string) => {
    // get direction we are traveling
    const nextPageNumber =
      direction === 'prev'
        ? pageNumber - 1 // if direction is prev, subtract 1 from pageNumber
        : pageNumber + 1 // if direction is next, add 1 to pageNumber

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    })

    router.push(newUrl) // push new url to router
  }

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation('prev')}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex justify-center rounded-md bg-primary-500  px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext} // disable button if there is no next page
        onClick={() => handleNavigation('next')}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  )
}

export default Pagination
