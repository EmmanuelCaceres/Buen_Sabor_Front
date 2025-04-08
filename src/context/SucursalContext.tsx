import { createContext, useContext, useState } from "react";

interface SucursalContextType {
  sucursalId: number | null;
  sucursalNombre: string | null;
  setSucursal: (id: number, nombre: string) => void;
}

const SucursalContext = createContext<SucursalContextType>({
  sucursalId: null,
  sucursalNombre: null,
  setSucursal: () => {},
});

export const useSucursal = () => useContext(SucursalContext);

export const SucursalProvider = ({ children }: { children: React.ReactNode }) => {
  const [sucursalId, setSucursalId] = useState<number | null>(null);
  const [sucursalNombre, setSucursalNombre] = useState<string | null>(null);

  const setSucursal = (id: number, nombre: string) => {
    setSucursalId(id);
    setSucursalNombre(nombre);
    localStorage.setItem("sucursalId", id.toString());
    localStorage.setItem("sucursalNombre", nombre);
  };

  return (
    <SucursalContext.Provider value={{ sucursalId, sucursalNombre, setSucursal }}>
      {children}
    </SucursalContext.Provider>
  );
};
