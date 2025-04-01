import { useStoreConfig } from '@/app/context/StoreContext'
import Image from 'next/image'
import React from 'react'

function Banner() {
  const { storeConfig } = useStoreConfig()
  return (
    <div className="bg-white w-full h-32 sm:h-60 relative rounded-2xl lg:h-72">
        <Image
          src={storeConfig.banner}
          alt="Home Banner"
          fill
          className="object-fit rounded-2xl"
        />
      </div>
  )
}

export default Banner