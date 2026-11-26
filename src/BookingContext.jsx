
import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
const [feedbackMessages, setFeedbackMessages] = useState([]);
  const addBooking = (booking) => {
    setBookings((previous) => [
      ...previous,
      {
        ...booking,
        id: Date.now(),
        bookingStatus: "Pending",
        paymentStatus: "Unpaid",
      },
    ]);
  };


const updateBookingStatus = (id, status) => {
  setBookings((previous) =>
    previous.map((booking) => {
      if (booking.id !== id) return booking;

      return {
        ...booking,
        bookingStatus: status,
        paymentDueDate:
          status === "Accepted"
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            : booking.paymentDueDate,
      };
    })
  );
};


  
const updatePaymentStatus = (id, status) => {
  const paymentDetails =
    status === "Paid (Demo)"
      ? {
          transactionId: `CS-PAY-${Date.now()}`,
          paymentDate: new Date().toLocaleString(),
        }
      : {};

  setBookings((previous) =>
    previous.map((booking) =>
      booking.id === id
        ? {
            ...booking,
            paymentStatus: status,
            ...paymentDetails,
          }
        : booking
    )
  );
};
const sendFeedback = (bookingId, sender, receiver, message) => {
  if (!message.trim()) return;

  setFeedbackMessages((previous) => [
    ...previous,
    {
      id: Date.now(),
      bookingId,
      sender,
      receiver,
      message: message.trim(),
      date: new Date().toLocaleString(),
    },
  ]);
};
  return (
    
    <BookingContext.Provider
     value={{
  bookings,
  addBooking,
  updateBookingStatus,
  updatePaymentStatus,
  feedbackMessages,
  sendFeedback,
}} 
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  return useContext(BookingContext);
}
