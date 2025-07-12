import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const ThemeContext = createContext();

export function ThemeProviderWrapper({ children }) {
  // On first load, get saved theme or default "light"
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  
  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const theme = useMemo(
    () => createTheme({ palette: { mode } }),
    [mode]
  );

  const setTheme = (newMode) => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, setTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
