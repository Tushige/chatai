import React from 'react'
import AppLogo from './app-logo'
import { GradientText } from './app-gradient-text'

const productName = 'AI CAMPAIGNER'
const AppPublicNavbar = () => {
  return (
    <div className="w-full py-4 gradient-background-2 text-text">
      <p className="font-medium text-center">
        <span>Booking powered by <a href="#" className="underline underline-offset-2"><GradientText>{`${' ' + productName}`}</GradientText></a></span>
      </p>
    </div>
  )
}

export default AppPublicNavbar