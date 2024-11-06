import type { FC } from 'react'
import React from 'react'
import Main from '@/app/components'
import GlobeError from '@/app/components/custom/error'

interface HomeProps {
  searchParams: { userName?: string; token?: string }
}

const Home: FC<HomeProps> = ({ searchParams }) => {
  const { userName, token } = searchParams

  if (!userName || !token) {
    return (
      <div className="flex flex-col justify-center align-center h-screen">
        <GlobeError/>
      </div>
    )
  }

  return <Main userName={userName} token={token}/>
}

export default Home
