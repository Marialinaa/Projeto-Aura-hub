import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
    screenHeight: 768,
    orientation: 'landscape'
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const orientation = height > width ? 'portrait' : 'landscape';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        orientation
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

// Utilitário para classes CSS responsivas
export const getResponsiveClasses = (deviceInfo: DeviceInfo) => {
  const { isMobile, isTablet, orientation } = deviceInfo;
  
  return {
    container: `${isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-8'}`,
    padding: `${isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'}`,
    text: {
      title: `${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'}`,
      subtitle: `${isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'}`,
      body: `${isMobile ? 'text-sm' : 'text-base'}`
    },
    button: `${isMobile ? 'h-12 text-base' : 'h-14 text-lg'}`,
    grid: `${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'}`,
    spacing: `${isMobile ? 'space-y-4' : 'space-y-6'}`,
    orientation: orientation === 'portrait' ? 'flex-col' : 'flex-row'
  };
};
