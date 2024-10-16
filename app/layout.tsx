import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.css'
// {/* className="overflow-x-auto" */ }
const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="h-full">
        <div >
          <div className="w-screen h-screen min-w-[300px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
