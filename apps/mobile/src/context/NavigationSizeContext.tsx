import React, { createContext, useContext, useState, useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface NavigationSizeContextType {
  isCompact: boolean;
  setIsCompact: (compact: boolean) => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const NavigationSizeContext = createContext<NavigationSizeContextType | undefined>(undefined);

export function NavigationSizeProvider({ children }: { children: React.ReactNode }) {
  const [isCompact, setIsCompact] = useState(false);
  const lastOffsetY = useRef(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const diff = currentOffsetY - lastOffsetY.current;

    // Scrolling down past 30px -> shrink into compact version
    if (diff > 8 && currentOffsetY > 30) {
      if (!isCompact) {
        setIsCompact(true);
      }
    }
    // Scrolling upward or near the very top -> expand smoothly back to normal
    else if (diff < -8 || currentOffsetY < 15) {
      if (isCompact) {
        setIsCompact(false);
      }
    }

    lastOffsetY.current = currentOffsetY;
  };

  return (
    <NavigationSizeContext.Provider
      value={{
        isCompact,
        setIsCompact,
        handleScroll,
      }}
    >
      {children}
    </NavigationSizeContext.Provider>
  );
}

export function useNavigationSize() {
  const context = useContext(NavigationSizeContext);
  if (!context) {
    return {
      isCompact: false,
      setIsCompact: () => {},
      handleScroll: () => {},
    };
  }
  return context;
}
