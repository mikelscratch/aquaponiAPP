import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [huertoData, setHuertoData] = useState(null); // Datos globales del huerto

  return (
    <GlobalContext.Provider value={{ huertoData, setHuertoData }}>
      {children}
    </GlobalContext.Provider>
  );
};