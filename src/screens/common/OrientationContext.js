import React, { createContext, useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const OrientationContext = createContext(false); // false = Portrait

export const OrientationProvider = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height
  );

  useEffect(() => {
    Orientation.lockToPortrait(); // Lock only this screen to portrait

    return () => {
      Orientation.unlockAllOrientations(); // Restore when navigating away
    };
  }, []);

  return (
    <OrientationContext.Provider value={isLandscape}>
      {children}
    </OrientationContext.Provider>
  );
};
