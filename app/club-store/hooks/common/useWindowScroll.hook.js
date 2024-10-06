/**
 * @file
 * userWindowScroll custom hook.
 */

import { useEffect, useState } from 'react';

export function useWindowScroll() {
  /**
   * Set initial window scrollY
   */
  const [windowScrollY, setWindowScrollY] = useState(0);

  /**
   * Set scroll functional
   */
  useEffect(() => {
    const handleWindowScroll = () => setWindowScrollY(window.scrollY);

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  return windowScrollY;
}
