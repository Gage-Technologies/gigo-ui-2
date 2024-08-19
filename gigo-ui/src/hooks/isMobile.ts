'use client';

import { useState, useEffect, useCallback } from 'react';

// hook to determine if the current device is mobile
// returns a boolean indicating mobile status and updates on window resize
function useIsMobile() {
  // initialize state with a function to perform the initial check
  const [isMobile, setIsMobile] = useState(() => {
    // check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      const mobileKeywords = [
        'Android',
        'webOS',
        'iPhone',
        'iPad',
        'iPod',
        'BlackBerry',
        'Windows Phone'
      ];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isMobileScreen = window.innerWidth <= 768;
      return isMobileDevice || isMobileScreen;
    }
    // default to false for server-side rendering
    return false;
  });

  // function to check if the device is mobile based on user agent and screen width
  const checkMobile = useCallback(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      const mobileKeywords = [
        'Android',
        'webOS',
        'iPhone',
        'iPad',
        'iPod',
        'BlackBerry',
        'Windows Phone'
      ];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isMobileScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || isMobileScreen);
    }
  }, []);

  useEffect(() => {
    // set up event listener for window resize
    window.addEventListener('resize', checkMobile);

    // cleanup function to remove event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  return isMobile;
}

export default useIsMobile;