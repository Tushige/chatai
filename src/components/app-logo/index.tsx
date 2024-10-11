import Image from 'next/image'
import React from 'react'

const AppLogo = ({
  width = 64,
  height = 64
}: {
  width?: number,
  height?: number
}) => {
  return (
    <Image
      src="/images/3d_6181570.png"
      width={width}
      height={height}
      alt="App logo"
    />
  )
}

export default AppLogo