import { createContext, useContext, useState } from "react";

const ShipmentContext = createContext();

export function ShipmentProvider({ children }) {
  const [shipments, setShipments] = useState([]);

  const addShipment = (shipment) => {
    setShipments((prev) => [...prev, shipment]);
  };

  return (
    <ShipmentContext.Provider value={{ shipments, addShipment }}>
      {children}
    </ShipmentContext.Provider>
  );
}

export function useShipments() {
  return useContext(ShipmentContext);
}