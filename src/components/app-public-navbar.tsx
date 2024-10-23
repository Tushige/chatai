import React from 'react';
import AppLogo from './app-logo';
import { GradientText } from './app-gradient-text';

const productName = 'ChatAI';
const AppPublicNavbar = () => {
  return (
    <div className='gradient-background-2 w-full py-4 text-text'>
      <p className='text-center font-medium'>
        <span>
          Booking powered by{' '}
          <a href='#' className='underline underline-offset-2'>
            <GradientText>{`${' ' + productName}`}</GradientText>
          </a>
        </span>
      </p>
    </div>
  );
};

export default AppPublicNavbar;
