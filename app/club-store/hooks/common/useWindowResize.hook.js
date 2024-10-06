/**
 * @file
 * userWindowSize custom hook.
 */

import { useLayoutEffect, useState } from 'react';

export function useWindowSize() {
  /**
   * Set initial size
   */
  const [size, setSize] = useState([0, 0]);

  /**
   * Set size functional
   */
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

export function useResponsive() {
  const [width] = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1280;
  const isDesktop = width >= 1280;
  const isUltra = width >= 1800;

  return {
    isMobile,
    isTablet,
    isDesktop,
    isUltra,
    width,
  };
}
