const CartPage = ({ cart, setCurrentPage, removeFromCart }) => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-green-800 mb-8 text-center">
        🛒 Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col justify-between"
              >
                <div
                  className="h-40 w-full bg-gray-100 rounded-lg mb-4 bg-center bg-cover"
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>
                <h3 className="text-lg font-bold text-green-700 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-700 mb-4 font-medium">${item.price}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage("payment")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition font-semibold w-full md:w-auto"
            >
              Proceed to Payment
            </button>

            <button
              onClick={() => setCurrentPage("products")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition font-semibold w-full md:w-auto"
            >
              Back to Products
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
