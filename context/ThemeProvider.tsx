// this is a director so it must be use client ;

'use client' // this is a client side file

import React, { createContext, useContext, useState, useEffect } from 'react' // import the createContext, useContext, useState, and useEffect hooks from the React package

// define types
interface ThemeContextType {
  mode: string
  setMode: (mode: string) => void
}

// create a new context called ThemeContext its going to be theme context or undefined
// use <> to specify the type of the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined) // create a new context called ThemeContext

// children is a prop that is passed to the ThemeProvider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState('')

  const handleThemeChange = () => {
    if (mode === 'dark') {
      setMode('light')
      document.documentElement.classList.add('light')
    }
    if (mode === 'light') {
      setMode('dark')
      document.documentElement.classList.add('dark')
    }
  }

  useEffect(() => {
    handleThemeChange()
  }, [mode])

  // useEffect is a hook that runs a function after the component has rendered
  // the empty array as the second argument means that the function will only run once

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
}
