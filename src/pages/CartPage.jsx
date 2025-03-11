const CartPage = ({ cart, setCurrentPage, removeFromCart }) => {
    return (
      <div>
        <h1 className="text-3xl font-bold text-green-800 mb-6">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cart.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                  <div
                    className="bg-gray-200 h-32 rounded-md mb-4"
                    style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover' }}
                  ></div>
                  <h3 className="text-lg font-semibold text-green-700">{item.title}</h3>
                  <p className="text-gray-600 mb-2">${item.price}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
  
            {/* Proceed to Payment Button */}
            <button
              onClick={() => setCurrentPage('payment')}  // This should correctly switch to 'payment'
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-4"
            >
              Proceed to Payment
            </button>
          </>
        )}
  
        {/* Go Back to Products Button */}
        <button
          onClick={() => setCurrentPage('products')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
        >
          Back to Products
        </button>
      </div>
    );
  };
  
  export default CartPage;
  