
import "./Dashboard.css";
import { jsPDF } from "jspdf";

function PaymentPage({ bookings, updatePaymentStatus, onBack }) {
  const acceptedBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Accepted" ||
      booking.bookingStatus === "Shipped"
  );

  const handlePayment = (booking) => {
    const confirmPayment = window.confirm(
      `Confirm simulated payment of INR ${booking.agreedPrice}?`
    );

    if (confirmPayment) {
      updatePaymentStatus(booking.id, "Paid (Demo)");
      alert("Demo payment successful!");
    }
  };

  // Download payment receipt as PDF.
  const downloadReceipt = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("CargoShare AI", 20, 25);

    doc.setFontSize(16);
    doc.text("Payment Receipt", 20, 42);

    doc.setFontSize(12);
    doc.text(`Transaction ID: ${booking.transactionId || "N/A"}`, 20, 60);
    doc.text(`Payment Date: ${booking.paymentDate || "N/A"}`, 20, 72);
    doc.text(`Amount Paid: INR ${booking.agreedPrice}`, 20, 84);
    doc.text(`Route: ${booking.origin} to ${booking.destination}`, 20, 96);
    doc.text("Payment Status: Payment Completed (Demo)", 20, 108);

    doc.setFontSize(10);
    doc.text("Thank you for using CargoShare AI!", 20, 135);

    doc.save(`CargoShare-Receipt-${booking.id}.pdf`);
  };

  const completedPayments = acceptedBookings.filter(
    (booking) => booking.paymentStatus !== "Unpaid"
  );

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        

        <p>Manage your accepted bookings and payment history.</p>

        {acceptedBookings.length === 0 ? (
          <div className="dashboard-card">
            <h3>No accepted bookings yet</h3>
            <p>
              Once a provider accepts your booking request, it will
              appear here.
            </p>
          </div>
        ) : (
          acceptedBookings.map((booking) => (
            <div
              className="dashboard-card payment-card"
              key={booking.id}
            >
              <h3>
                {booking.origin} → {booking.destination}
              </h3>

              {booking.bookingStatus === "Shipped" ? (
                <p className="payment-accepted-message">
                  🚚 Great news! Your goods have been shipped by the
                  logistics provider.
                </p>
              ) : (
                <p className="payment-accepted-message">
                  ✓ The provider has accepted your request!
                </p>
              )}

              <p>
                <strong>Booking Status:</strong>{" "}
                {booking.bookingStatus}
              </p>

              <p>
                <strong>Agreed Amount:</strong> INR{" "}
                {booking.agreedPrice}
              </p>

              <p>
                <strong>Payment Status:</strong>{" "}
                {booking.paymentStatus}
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
                    <strong>Amount Paid:</strong> INR{" "}
                    {booking.agreedPrice}
                  </p>

                  <p>
                    <strong>Route:</strong> {booking.origin} →{" "}
                    {booking.destination}
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

                  <button
                    type="button"
                    className="download-receipt-btn"
                    onClick={() => downloadReceipt(booking)}
                  >
                    Download Receipt
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

        <section className="payment-history">
          <h2>Payment History</h2>

          {completedPayments.length === 0 ? (
            <p>No completed payments yet.</p>
          ) : (
            completedPayments.map((booking) => (
              <div
                className="dashboard-card"
                key={booking.id}
              >
                <p>
                  {booking.origin} → {booking.destination}
                </p>

                <p>
                  Amount: INR {booking.agreedPrice}
                </p>

                <p>
                  Status: {booking.paymentStatus}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default PaymentPage;
