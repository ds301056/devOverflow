'use client' // Directive for Next.js to treat this file as a client-side file

import React, { createContext, useContext, useState, useEffect } from 'react' // Importing necessary hooks and functions from React

// Define the shape of the context's value with an interface
interface ThemeContextType {
  mode: string // The current theme mode (either 'light' or 'dark')
  setMode: (mode: string) => void // Function to set the theme mode
}

// Create a context with the defined shape, initially undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ThemeProvider component to provide the theme context to its children
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState('') // State to hold the current theme mode

  // Function to handle theme changes based on local storage and user preferences
  const handleThemeChange = () => {
    if (
      localStorage.theme === 'dark' || // Check if 'theme' in localStorage is 'dark'
      (!('theme' in localStorage) && // Or if 'theme' is not in localStorage and
        window.matchMedia('(prefers-color-scheme: dark)').matches) // User prefers dark mode
    ) {
      setMode('dark') // Set theme mode to 'dark'
      document.documentElement.classList.add('dark') // Add 'dark' class to the HTML element
    } else {
      setMode('light') // Set theme mode to 'light'
      document.documentElement.classList.remove('dark') // Remove 'dark' class from the HTML element
    }
  }

  // useEffect hook to run handleThemeChange when the mode state changes
  useEffect(() => {
    handleThemeChange()
  }, [mode]) // Dependency array with 'mode' to trigger the effect on mode changes

  // console.log('MODE, ', mode) // Log the current mode to the console

  // Provide the theme context to the children components
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use the theme context in components
export function useTheme() {
  const context = useContext(ThemeContext) // Access the context value

  // If context is undefined, it means the hook is used outside of a ThemeProvider
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context // Return the context value (mode and setMode)
}
