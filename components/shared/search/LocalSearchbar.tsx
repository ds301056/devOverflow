'use client'

import { Input } from '@/components/ui/input'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

// declare the props being passed into the interface of the component
interface CustomInputProps {
  route: string
  iconPosition: string
  imgSrc: string
  placeholder: string
  otherClasses: string
}

// declare the props being passed into the component
const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter() // use the useRouter hook to get the current route
  const pathname = usePathname() // use the usePathname hook to get the current pathname
  const searchParams = useSearchParams() // use the useSearchParams hook to get the current search params

  const query = searchParams.get('q') // get the value of the search query

  const [search, setSearch] = useState(query || '') // set the search query to an empty string

  // console.log(query)

  // handle the search query change url based off input value
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'q',
          value: search,
        })

        router.push(newUrl, { scroll: false }) // push the new url to the router
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['q'],
          })

          router.push(newUrl, { scroll: false }) // push the new empty url to the router
        }
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn) // clear the timeout
  }, [search, route, pathname, router, searchParams, query])

  return (
    <div
      className={`text-dark400_light700 flex min-h-[56px] grow items-center gap-4 rounded-[10px] bg-transparent px-4 ${otherClasses}`}
    >
      {iconPosition === 'left' && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)} // set the search query to the value of the input
        className="paragraph-regular no-focus placeholder background-light800_darkgradient text-dark100_light900 border-none shadow-none outline-none"
      />

      {iconPosition === 'right' && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  )
}

export default LocalSearchbar
