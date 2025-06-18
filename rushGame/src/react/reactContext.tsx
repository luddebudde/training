import React, { createContext, useContext, useState } from "react";

type Menu = "main" | "practice" | "statistics" | "none";

type MenuContextType = {
  currentMenu: string;
  setMenu: (menu: Menu) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }) => {
  const [currentMenu, setMenu] = useState<
    "main" | "practice" | "statistics" | "none"
  >("main");

  return (
    <MenuContext.Provider
      value={{
        currentMenu,
        setMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
