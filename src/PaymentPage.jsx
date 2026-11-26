
import "./Dashboard.css";

function PaymentPage({ bookings, updatePaymentStatus, onBack }) {
 const acceptedBookings = bookings.filter(
  (booking) =>
    booking.bookingStatus === "Accepted" ||
    booking.bookingStatus === "Shipped"
); 

  const handlePayment = (booking) => {
    const confirmPayment = window.confirm(
      `Confirm simulated payment of ₹${booking.agreedPrice}?`
    );

    if (confirmPayment) {
      updatePaymentStatus(booking.id, "Paid (Demo)");
      alert("Demo payment successful!");
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h2>CargoShare AI</h2>
        <span>Payments</span>

        <button type="button" onClick={onBack}>
          Back to Dashboard
        </button>
      </nav>

      <div className="dashboard-content">
        <h1>My Payments</h1>
        <p>Manage your accepted bookings and payment history.</p>

        {acceptedBookings.length === 0 ? (
          <div className="dashboard-card">
            <h3>No accepted bookings yet</h3>
            <p>
              Once a provider accepts your booking request,
              it will appear here.
            </p>
          </div>
        ) : (
          acceptedBookings.map((booking) => (
            <div className="dashboard-card payment-card" key={booking.id}>
              <h3>
                {booking.origin} → {booking.destination}
              </h3>
              {booking.bookingStatus === "Shipped" ? (
  <p className="payment-accepted-message">
    🚚 Great news! Your goods have been shipped by the logistics provider.
  </p>
) : (
  <p className="payment-accepted-message">
    ✓ The provider has accepted your request!
  </p>
)}

              <p>
                <strong>Booking Status:</strong> Accepted
              </p>

              <p>
                <strong>Agreed Amount:</strong> ₹{booking.agreedPrice}
              </p>

              <p>
                <strong>Payment Status:</strong> {booking.paymentStatus}
              </p>
             {booking.paymentStatus === "Paid (Demo)" && (
  <div className="payment-receipt">
    <h3>Payment Receipt</h3>

    <p>
      <strong>Transaction ID:</strong>{" "}
      {booking.transactionId}
    </p>

    <p>
      <strong>Payment Date:</strong>{" "}
      {booking.paymentDate}
    </p>

    <p>
      <strong>Amount Paid:</strong>{" "}
      ₹{booking.agreedPrice}
    </p>

    <p>
      <strong>Route:</strong>{" "}
      {booking.origin} → {booking.destination}
    </p>

    <p>
      <strong>Status:</strong> Payment Completed (Demo)
    </p>
   <button
  type="button"
  onClick={() => window.print()}
>
  Print Receipt
</button> 
  </div>
)} 

              {booking.paymentStatus === "Unpaid" ? (
                <button
                  type="button"
                  className="pay-now-btn"
                  onClick={() => handlePayment(booking)}
                >
                  Pay Now
                </button>
              ) : (
                <p className="payment-accepted-message">
                  ✓ Payment Completed (Demo)
                </p>
              )}
            </div>
          ))
        )}

        <h2>Payment History</h2>

        {acceptedBookings.filter(
          (booking) => booking.paymentStatus !== "Unpaid"
        ).length === 0 ? (
          <p>No completed payments yet.</p>
        ) : (
          acceptedBookings
            .filter((booking) => booking.paymentStatus !== "Unpaid")
            .map((booking) => (
              <div className="dashboard-card" key={booking.id}>
                <p>
                  {booking.origin} → {booking.destination}
                </p>
                <p>Amount: ₹{booking.agreedPrice}</p>
                <p>Status: {booking.paymentStatus}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
