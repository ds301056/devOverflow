import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import qs from 'query-string'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date()
  const diff = now.getTime() - createdAt.getTime()

  // Calculate differences in various time units
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  // Return appropriate string based on the largest time unit difference
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`
  }
}
export const formatAndDivideNumber = (
  number: number | undefined | null,
): string => {
  // Check if the number is undefined or null
  // This prevents calling toString on an undefined or null value
  if (number === undefined || number === null) {
    return '0' // Return '0' or any default value you'd prefer when the number is undefined or null
  }

  if (number >= 1000000) {
    // If the number is greater than or equal to one million
    const millions = (number / 1000000).toFixed(1) // Divide by one million and keep one decimal place
    return `${millions}m` // Return the formatted string with 'm' for millions
  } else if (number >= 1000) {
    // If the number is greater than or equal to one thousand
    const thousands = (number / 1000).toFixed(1) // Divide by one thousand and keep one decimal place
    return `${thousands}k` // Return the formatted string with 'k' for thousands
  } else {
    // If the number is less than one thousand, return it as is
    return number.toString() // Convert the number to a string and return it
  }
}

export const getJoinedDate = (date: Date): string => {
  // Extract the month and year from the Date object
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()

  // Create the joined date string (e.g., "September 2023")
  const joinedDate = `${month} ${year}`

  return joinedDate
}

// interface for url query params object
interface UrlQueryParams {
  params: string
  key: string
  value: string | null
}

// form url for search query based off input value
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  )
}

interface RemoveUrlQueryParams {
  params: string
  keysToRemove: string[]
}

// form url for search query based off input value (empty value)
export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params) // parse the current url query params

  // remove the keys from the current url query params
  keysToRemove.forEach((key) => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  )
}
