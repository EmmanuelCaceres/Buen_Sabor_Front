import React, { createContext, useContext, useState } from "react";

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
  // 1. Inicializamos leyendo del localStorage (a prueba de F5)
  const [sucursalId, setSucursalId] = useState<number | null>(() => {
    const saved = localStorage.getItem("sucursalId");
    return saved ? parseInt(saved, 10) : null;
  });

  const [sucursalNombre, setSucursalNombre] = useState<string | null>(() => {
    return localStorage.getItem("sucursalNombre") || null;
  });

  // 2. Al setear, actualizamos estado y memoria persistente
  const setSucursal = (id: number, nombre: string) => {
    setSucursalId(id);
    setSucursalNombre(nombre);
    localStorage.setItem("sucursalId", id.toString());
    localStorage.setItem("sucursalNombre", nombre);
    // Por retrocompatibilidad por si tu Home usó el otro nombre de clave:
    localStorage.setItem("selectedSucursalId", id.toString()); 
  };

  return (
    <SucursalContext.Provider value={{ sucursalId, sucursalNombre, setSucursal }}>
      {children}
    </SucursalContext.Provider>
  );
};