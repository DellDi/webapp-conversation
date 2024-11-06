import React from 'react'
import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang={'zh'} className="h-full">
    <body className="h-full">
    <div>
      <div className="w-screen h-screen min-w-[300px]">
        {children}
      </div>
    </div>
    </body>
    </html>
  )
}

export default LocaleLayout
