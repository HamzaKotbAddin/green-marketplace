import React from "react";

const CartPage = ({
  cart,
  setCurrentPage,
  updateQuantity,
  setItemQuantity,
}) => {
  // Compute totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-green-800 mb-8 text-center">
        🛒 Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          Your cart is empty.
        </p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-start py-6"
              >
                {/* Left: image + details */}
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-green-700">
                      {item.title}
                    </h2>
                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>

                    {/* quantity selector + delete */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100 transition"
                      >
                        –
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          setItemQuantity(
                            item.id,
                            Math.max(0, parseInt(e.target.value, 10) || 0)
                          )
                        }
                        className="w-12 text-center border rounded"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, +1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => setItemQuantity(item.id, 0)}
                        className="ml-4 text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: line total */}
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Subtotal and actions */}
          <div className="border-t pt-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-lg">
              Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""}):{" "}
              <span className="font-bold">${grandTotal}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage("products")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Back to Products
              </button>
              <button
                onClick={() => setCurrentPage("payment")}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold"
              >
                Proceed to Buy
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
