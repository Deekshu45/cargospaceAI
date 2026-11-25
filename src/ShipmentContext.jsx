import { createContext, useContext, useState } from "react";

const ShipmentContext = createContext();

export function ShipmentProvider({ children }) {
  const [shipments, setShipments] = useState([]);

  const addShipment = (shipment) => {
    setShipments((prev) => [...prev, shipment]);
  };
  const deleteShipment = (shipmentId) => {
  setShipments((prev) =>
    prev.filter((shipment) => shipment.id !== shipmentId)
  );
};

  return (
    <ShipmentContext.Provider value={{ shipments, addShipment , deleteShipment}}>
      {children}
    </ShipmentContext.Provider>
  );
}

export function useShipments() {
  return useContext(ShipmentContext);
}