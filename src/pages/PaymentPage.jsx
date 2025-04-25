import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaymentPage = ({ cart, setCurrentPage }) => {
  // Now multiply price by quantity for each item
  const totalAmount = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Payment</h1>
      <p className="text-gray-700 mb-4">
        Total: <span className="font-bold">${totalAmount}</span>
      </p>

      <div className="space-y-6">
        {/* PayPal Payment Option */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Pay with PayPal</h2>
          <PayPalScriptProvider
            options={{
              "client-id":
                "AQU38Dse_L0DozQKMD3t0pTnAi7K9-Ff5aG7eEuAE3rj0VZMyNFK5oAq8aZivAoupIGO8eqvo9MpEAGz",
            }}
          >
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{ amount: { value: totalAmount } }],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(() => {
                  setCurrentPage("success");
                });
              }}
              onError={(err) => {
                console.error("PayPal Checkout Error:", err);
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>

      <button
        onClick={() => setCurrentPage("cart")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-6 w-full"
      >
        Back to Cart
      </button>
    </div>
  );
};

export default PaymentPage;
