import React, { createContext, useContext, useState} from "react";

type RolType = "SUPERADMIN" | "ADMIN" | "CLIENTE" | "COCINERO" | "CAJERO" | "DELIVERY" | null;

interface RolContextProps {
  rol: RolType;
  setRol: (rol: RolType) => void;
  logoutRol: () => void;
}

const RolContext = createContext<RolContextProps | undefined>(undefined);

export const RolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rol, setRolState] = useState<RolType>(() => {
    return (localStorage.getItem("userRole") as RolType) || null;
  });

  const setRol = (nuevoRol: RolType) => {
    setRolState(nuevoRol);
    if (nuevoRol) {
      localStorage.setItem("userRole", nuevoRol);
    } else {
      localStorage.removeItem("userRole");
    }
  };

  const logoutRol = () => {
    setRolState(null);
    localStorage.removeItem("userRole");
  };

  return (
    <RolContext.Provider value={{ rol, setRol, logoutRol }}>
      {children}
    </RolContext.Provider>
  );
};

export const useRol = () => {
  const context = useContext(RolContext);
  if (!context) throw new Error("useRol debe usarse dentro de un RolProvider");
  return context;
};