'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import GlobalResult from './GlobalResult'

const GlobalSearch = () => {
  // add user functionality with "useEffect" and "useState" hooks
  const router = useRouter() // use the useRouter hook to get the current route
  const pathname = usePathname() // use the usePathname hook to get the current pathname
  const searchParams = useSearchParams() // use the useSearchParams hook to get the current search params

  const query = searchParams.get('q') // get the value of the search query

  const [search, setSearch] = useState(query || '') // set the search query to an empty string
  const [isOpen, setIsOpen] = useState(false) // is the modal open or closed state - false by default
  // console.log(query)

  // handle the search query change url based off input value
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        })

        router.push(newUrl, { scroll: false }) // push the new url to the router
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['global', 'type'],
          })

          router.push(newUrl, { scroll: false }) // push the new empty url to the router
        }
      }
    }, 300) // 300 millisecond debounce

    return () => clearTimeout(delayDebounceFn) // clear the timeout
  }, [search, router, pathname, searchParams, query])

  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt={'search'}
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search My App Globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)

            if (!isOpen) setIsOpen(true)

            // is value empty?
            if (e.target.value === '' && isOpen) setIsOpen(false) // close the modal
          }}
          className="paragraph-regular no-focus placeholder background-light800_darkgradient text-dark400_light700 border-none shadow-none outline-none"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  )
}

export default GlobalSearch
