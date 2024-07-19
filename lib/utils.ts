import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeStamp = (createdAt: Date): string => {
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
export const formatAndDivideNumber = (number: number): string => {
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
    return number.toString()
  }
}
