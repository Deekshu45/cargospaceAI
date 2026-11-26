
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ShipmentProvider } from "./ShipmentContext.jsx";
import { BookingProvider } from "./BookingContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ShipmentProvider>
      <BookingProvider>
        <App />
      </BookingProvider>
    </ShipmentProvider>
  </StrictMode>
);
