import React from 'react'

export default function OwlLogo({...props}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={50}
      fillRule="evenodd"
      clipRule="evenodd"
      style={{
        backgroundColor: '#121212',
        borderRadius: '100%'
      }}
    {...props}
  >
    <path
      fill="#f05a7e" d="M25 2C12.304 2 2.012 12.298 2.012 25c0 11.663 8.677 21.296 19.923 22.796v-4.635a3.05 3.05 0 0 0-2.062-2.897c-6.489-2.181-11.132-8.387-10.961-15.653A16.038 16.038 0 0 1 25.165 8.9c8.812.09 15.927 7.264 15.927 16.1 0 .828-.064 1.656-.189 2.474-1.97 12.985-18.874 20.282-18.966 20.322C22.939 47.93 23.961 48 25 48c12.696 0 22.989-10.297 22.989-23S37.696 2 25 2" />
  </svg>
  )
}
